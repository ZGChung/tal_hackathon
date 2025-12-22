from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import os

# Password hashing context
# Configure to avoid bcrypt bug detection issues with newer bcrypt versions
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    # Don't set bcrypt__ident or bcrypt__rounds explicitly - let passlib handle it
    # This avoids issues with bcrypt bug detection
)

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    try:
        # Ensure password is a string and not too long (bcrypt limit is 72 bytes)
        if isinstance(plain_password, bytes):
            plain_password = plain_password.decode('utf-8')
        
        # Truncate if necessary (though this shouldn't happen with normal passwords)
        if len(plain_password.encode('utf-8')) > 72:
            plain_password = plain_password[:72]
        
        return pwd_context.verify(plain_password, hashed_password)
    except (ValueError, TypeError) as e:
        # Handle bcrypt errors gracefully
        print(f"Password verification error: {e}")
        return False


def get_password_hash(password: str) -> str:
    """Hash a password"""
    try:
        # Ensure password is a string
        if isinstance(password, bytes):
            password = password.decode('utf-8')
        elif not isinstance(password, str):
            password = str(password)
        
        # Strip whitespace
        password = password.strip()
        
        # Check password length in bytes (bcrypt limit is 72 bytes)
        password_bytes = password.encode('utf-8')
        if len(password_bytes) > 72:
            print(f"WARNING: Password is {len(password_bytes)} bytes, truncating to 72")
            # Truncate the bytes, then decode back to string
            password = password_bytes[:72].decode('utf-8', errors='ignore')
        
        # Use passlib's hash method directly with the password as a string
        # Passlib will handle the encoding internally
        return pwd_context.hash(password)
    except (ValueError, TypeError) as e:
        # Handle bcrypt errors with more detail
        print(f"Password hashing error - password type: {type(password)}, length: {len(str(password)) if password else 0}")
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

