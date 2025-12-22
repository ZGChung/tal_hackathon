from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import Optional

from backend.database import get_db
from backend.models.curriculum import Curriculum
from backend.models.preferences import Preferences
from backend.models.user import User
from backend.schemas.rewrite import RewriteRequest, RewriteResponse
from backend.utils.dependencies import get_current_user
from backend.services.rewriter import RewriterService

router = APIRouter(prefix="/api/rewrite", tags=["rewrite"])


def get_active_curriculum(db: Session, curriculum_id: Optional[int] = None) -> Curriculum:
    """
    Get active curriculum (from any admin)
    
    Args:
        db: Database session
        curriculum_id: Optional specific curriculum ID, otherwise uses most recent from any admin
        
    Returns:
        Curriculum object
        
    Raises:
        HTTPException: If curriculum not found
    """
    if curriculum_id:
        curriculum = db.query(Curriculum).filter(
            Curriculum.id == curriculum_id
        ).first()
    else:
        # Get most recent curriculum from any admin
        curriculum = db.query(Curriculum).order_by(Curriculum.created_at.desc()).first()
    
    if not curriculum:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curriculum not found. Please ask an admin to upload a curriculum first."
        )
    
    return curriculum


def get_active_preferences(db: Session) -> Optional[Preferences]:
    """
    Get active preferences (from any admin)
    
    Args:
        db: Database session
        
    Returns:
        Preferences object or None if not found
    """
    # Get most recent preferences from any admin (by updated_at, fallback to created_at)
    return db.query(Preferences).order_by(
        func.coalesce(Preferences.updated_at, Preferences.created_at).desc()
    ).first()


@router.post("", response_model=RewriteResponse, status_code=status.HTTP_200_OK)
async def rewrite_text(
    request: RewriteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Rewrite text to incorporate curriculum keywords
    Available to all authenticated users (students and admins)
    
    Args:
        request: Rewrite request with text and optional curriculum_id
        current_user: Current authenticated user (from dependency)
        db: Database session
        
    Returns:
        RewriteResponse with original text, rewritten text, and keywords used
    """
    # Get curriculum (from any admin)
    curriculum = get_active_curriculum(
        db=db,
        curriculum_id=request.curriculum_id
    )
    
    # Get preferences (optional, from any admin)
    preferences = get_active_preferences(db=db)
    
    # Extract keywords
    curriculum_keywords = curriculum.keywords if curriculum.keywords else []
    preference_keywords = preferences.keywords if preferences and preferences.keywords else []
    
    # Rewrite text
    rewriter = RewriterService()
    rewritten_text, keywords_used = rewriter.rewrite(
        original_text=request.text,
        curriculum_keywords=curriculum_keywords,
        preference_keywords=preference_keywords
    )
    
    return RewriteResponse(
        original_text=request.text,
        rewritten_text=rewritten_text,
        keywords_used=keywords_used
    )

