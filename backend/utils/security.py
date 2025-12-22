from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
import os

# Use bcrypt directly instead of passlib to avoid initialization bug detection issues
# This avoids the 72-byte error during passlib's detect_wrap_bug function

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash using bcrypt directly"""
    try:
        # Ensure password is bytes for bcrypt
        if isinstance(plain_password, str):
            password_bytes = plain_password.encode("utf-8")
        else:
            password_bytes = plain_password

        # Ensure hash is bytes
        if isinstance(hashed_password, str):
            hash_bytes = hashed_password.encode("utf-8")
        else:
            hash_bytes = hashed_password

        # Use bcrypt directly
        return bcrypt.checkpw(password_bytes, hash_bytes)
    except (ValueError, TypeError) as e:
        # Handle bcrypt errors gracefully
        print(f"Password verification error: {e}")
        return False


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt directly"""
    try:
        # Ensure password is a string
        if isinstance(password, bytes):
            password = password.decode("utf-8")
        elif not isinstance(password, str):
            password = str(password)

        # Strip whitespace
        password = password.strip()

        # Convert to bytes for bcrypt
        password_bytes = password.encode("utf-8")

        # Check password length (bcrypt limit is 72 bytes)
        if len(password_bytes) > 72:
            print(f"WARNING: Password is {len(password_bytes)} bytes, truncating to 72")
            password_bytes = password_bytes[:72]

        # Generate salt and hash using bcrypt directly
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password_bytes, salt)

        # Return as string (bcrypt hash is always ASCII)
        return hashed.decode("utf-8")
    except (ValueError, TypeError) as e:
        # Handle bcrypt errors with more detail
        print(
            f"Password hashing error - password type: {type(password)}, length: {len(str(password)) if password else 0}"
        )
        if isinstance(password, str):
            print(f"Password bytes length: {len(password.encode('utf-8'))}")
        raise ValueError(f"Password hashing error: {e}")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
