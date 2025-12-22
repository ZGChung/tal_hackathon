from pydantic import BaseModel
from typing import List
from datetime import datetime


class CurriculumUploadResponse(BaseModel):
    """Schema for curriculum upload response"""
    id: int
    filename: str
    keywords: List[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class CurriculumListItem(BaseModel):
    """Schema for curriculum list item"""
    id: int
    filename: str
    keywords: List[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class CurriculumDetail(BaseModel):
    """Schema for curriculum detail response"""
    id: int
    filename: str
    keywords: List[str]
    file_path: str
    created_at: datetime
    
    class Config:
        from_attributes = True

