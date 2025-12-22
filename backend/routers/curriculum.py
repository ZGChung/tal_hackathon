from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
from pathlib import Path

from backend.database import get_db
from backend.models.curriculum import Curriculum
from backend.schemas.curriculum import (
    CurriculumUploadResponse,
    CurriculumListItem,
    CurriculumDetail
)
from backend.utils.dependencies import get_admin_user
from backend.models.user import User
from backend.services.curriculum_parser import parse_markdown_keywords

router = APIRouter(prefix="/api/curriculum", tags=["curriculum"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("backend/uploads/curriculum")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload", response_model=CurriculumUploadResponse, status_code=status.HTTP_200_OK)
async def upload_curriculum(
    file: UploadFile = File(...),
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Upload a markdown curriculum file (Admin only)"""
    # Validate file extension
    if not file.filename.endswith('.md'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only markdown (.md) files are allowed"
        )
    
    # Read file content
    content = await file.read()
    content_str = content.decode('utf-8')
    
    # Parse markdown to extract keywords
    keywords = parse_markdown_keywords(content_str)
    
    # Save file to uploads directory
    file_path = UPLOAD_DIR / file.filename
    with open(file_path, 'wb') as f:
        f.write(content)
    
    # Create curriculum record in database
    curriculum = Curriculum(
        user_id=current_user.id,
        filename=file.filename,
        file_path=str(file_path),
        keywords=keywords
    )
    
    db.add(curriculum)
    db.commit()
    db.refresh(curriculum)
    
    return CurriculumUploadResponse(
        id=curriculum.id,
        filename=curriculum.filename,
        keywords=curriculum.keywords,
        created_at=curriculum.created_at
    )


@router.get("", response_model=List[CurriculumListItem], status_code=status.HTTP_200_OK)
async def list_curricula(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """List all curricula (Admin only)"""
    curricula = db.query(Curriculum).filter(Curriculum.user_id == current_user.id).all()
    
    return [
        CurriculumListItem(
            id=curriculum.id,
            filename=curriculum.filename,
            keywords=curriculum.keywords,
            created_at=curriculum.created_at
        )
        for curriculum in curricula
    ]


@router.get("/{curriculum_id}", response_model=CurriculumDetail, status_code=status.HTTP_200_OK)
async def get_curriculum(
    curriculum_id: int,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get curriculum by ID (Admin only)"""
    curriculum = db.query(Curriculum).filter(
        Curriculum.id == curriculum_id,
        Curriculum.user_id == current_user.id
    ).first()
    
    if not curriculum:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curriculum not found"
        )
    
    return CurriculumDetail(
        id=curriculum.id,
        filename=curriculum.filename,
        keywords=curriculum.keywords,
        file_path=curriculum.file_path,
        created_at=curriculum.created_at
    )

