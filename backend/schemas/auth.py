from pydantic import BaseModel, Field
from typing import Optional
from backend.models.user import UserRole


class UserRegister(BaseModel):
    """Schema for user registration"""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    role: UserRole


class UserLogin(BaseModel):
    """Schema for user login"""
    username: str
    password: str


class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    username: str
    role: str
    
    class Config:
        from_attributes = True


class RegisterResponse(BaseModel):
    """Schema for registration response"""
    message: str
    user_id: int


# Update forward references
Token.model_rebuild()

