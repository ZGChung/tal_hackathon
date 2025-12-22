from pydantic import BaseModel, Field
from typing import List
from datetime import datetime


class PreferencesCreate(BaseModel):
    """Schema for creating preferences"""
    focus_areas: List[str] = Field(..., description="List of focus areas")
    keywords: List[str] = Field(..., description="List of keywords")
    subject_preferences: List[str] = Field(..., description="List of subject preferences")


class PreferencesUpdate(BaseModel):
    """Schema for updating preferences"""
    focus_areas: List[str] = Field(..., description="List of focus areas")
    keywords: List[str] = Field(..., description="List of keywords")
    subject_preferences: List[str] = Field(..., description="List of subject preferences")


class PreferencesResponse(BaseModel):
    """Schema for preferences response"""
    id: int
    focus_areas: List[str]
    keywords: List[str]
    subject_preferences: List[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

