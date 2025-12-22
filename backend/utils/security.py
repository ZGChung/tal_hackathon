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
    bcrypt__ident="2b",  # Use 2b identifier to avoid bug detection
    bcrypt__rounds=12  # Set rounds explicitly to avoid initialization issues
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
        # Ensure password is a string and not too long
        if isinstance(password, bytes):
            password = password.decode('utf-8')
        
        # Truncate if necessary (though this shouldn't happen with normal passwords)
        if len(password.encode('utf-8')) > 72:
            password = password[:72]
        
        return pwd_context.hash(password)
    except (ValueError, TypeError) as e:
        # Handle bcrypt errors
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

