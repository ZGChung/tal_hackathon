from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from backend.database import get_db
from backend.models.curriculum import Curriculum
from backend.models.preferences import Preferences
from backend.models.user import User
from backend.schemas.rewrite import RewriteRequest, RewriteResponse
from backend.utils.dependencies import get_admin_user
from backend.services.rewriter import RewriterService

router = APIRouter(prefix="/api/rewrite", tags=["rewrite"])


def get_active_curriculum(user_id: int, db: Session, curriculum_id: Optional[int] = None) -> Curriculum:
    """
    Get active curriculum for user
    
    Args:
        user_id: User ID
        db: Database session
        curriculum_id: Optional specific curriculum ID, otherwise uses most recent
        
    Returns:
        Curriculum object
        
    Raises:
        HTTPException: If curriculum not found
    """
    if curriculum_id:
        curriculum = db.query(Curriculum).filter(
            Curriculum.id == curriculum_id,
            Curriculum.user_id == user_id
        ).first()
    else:
        # Get most recent curriculum for user
        curriculum = db.query(Curriculum).filter(
            Curriculum.user_id == user_id
        ).order_by(Curriculum.created_at.desc()).first()
    
    if not curriculum:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Curriculum not found. Please upload a curriculum first."
        )
    
    return curriculum


def get_user_preferences(user_id: int, db: Session) -> Optional[Preferences]:
    """
    Get preferences for user
    
    Args:
        user_id: User ID
        db: Database session
        
    Returns:
        Preferences object or None if not found
    """
    return db.query(Preferences).filter(
        Preferences.user_id == user_id
    ).first()


@router.post("", response_model=RewriteResponse, status_code=status.HTTP_200_OK)
async def rewrite_text(
    request: RewriteRequest,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """
    Rewrite text to incorporate curriculum keywords
    
    Args:
        request: Rewrite request with text and optional curriculum_id
        current_user: Current admin user (from dependency)
        db: Database session
        
    Returns:
        RewriteResponse with original text, rewritten text, and keywords used
    """
    # Get curriculum
    curriculum = get_active_curriculum(
        user_id=current_user.id,
        db=db,
        curriculum_id=request.curriculum_id
    )
    
    # Get preferences (optional)
    preferences = get_user_preferences(user_id=current_user.id, db=db)
    
    # Extract keywords
    curriculum_keywords = curriculum.keywords if curriculum.keywords else []
    preference_keywords = preferences.keywords if preferences and preferences.keywords else []
    
    # Rewrite text
    rewriter = RewriterService()
    rewritten_text = rewriter.rewrite(
        original_text=request.text,
        curriculum_keywords=curriculum_keywords,
        preference_keywords=preference_keywords
    )
    
    # Combine all keywords used
    all_keywords = list(set(curriculum_keywords + preference_keywords))
    
    return RewriteResponse(
        original_text=request.text,
        rewritten_text=rewritten_text,
        keywords_used=all_keywords
    )

