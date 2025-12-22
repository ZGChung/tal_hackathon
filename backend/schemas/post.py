from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class Post(BaseModel):
    """Schema for a RedNote post"""
    id: str
    author: str = Field(..., description="Username of the post author")
    text: str = Field(..., description="Post content in Chinese")
    image_url: str = Field(..., description="URL to the post image")
    likes: int = Field(..., ge=0, description="Number of likes")
    timestamp: datetime = Field(..., description="Post creation timestamp")
    comments: Optional[int] = Field(default=0, ge=0, description="Number of comments")
    shares: Optional[int] = Field(default=0, ge=0, description="Number of shares")
    
    class Config:
        from_attributes = True

