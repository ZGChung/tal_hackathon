from pydantic import BaseModel, Field
from typing import List, Optional


class RewriteRequest(BaseModel):
    """Schema for rewrite request"""
    text: str = Field(..., description="Text to be rewritten")
    curriculum_id: Optional[int] = Field(None, description="Optional curriculum ID. Uses most recent if not provided")


class RewriteResponse(BaseModel):
    """Schema for rewrite response"""
    original_text: str
    rewritten_text: str
    keywords_used: List[str]

