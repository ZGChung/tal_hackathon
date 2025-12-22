from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.preferences import Preferences
from backend.models.user import User
from backend.schemas.preferences import (
    PreferencesCreate,
    PreferencesUpdate,
    PreferencesResponse
)
from backend.utils.dependencies import get_admin_user

router = APIRouter(prefix="/api/preferences", tags=["preferences"])


@router.post("", response_model=PreferencesResponse, status_code=status.HTTP_200_OK)
async def create_preferences(
    preferences_data: PreferencesCreate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create preferences for current admin user"""
    # Check if preferences already exist for this user
    existing_preferences = db.query(Preferences).filter(
        Preferences.user_id == current_user.id
    ).first()
    
    if existing_preferences:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Preferences already exist for this user. Use PUT to update."
        )
    
    # Create new preferences
    new_preferences = Preferences(
        user_id=current_user.id,
        focus_areas=preferences_data.focus_areas,
        keywords=preferences_data.keywords,
        subject_preferences=preferences_data.subject_preferences
    )
    
    db.add(new_preferences)
    db.commit()
    db.refresh(new_preferences)
    
    return new_preferences


@router.get("", response_model=PreferencesResponse)
async def get_preferences(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get current admin user's preferences"""
    preferences = db.query(Preferences).filter(
        Preferences.user_id == current_user.id
    ).first()
    
    if not preferences:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Preferences not found for this user"
        )
    
    return preferences


@router.put("/{preferences_id}", response_model=PreferencesResponse)
async def update_preferences(
    preferences_id: int,
    preferences_data: PreferencesUpdate,
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update preferences for current admin user"""
    preferences = db.query(Preferences).filter(
        Preferences.id == preferences_id
    ).first()
    
    if not preferences:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Preferences not found"
        )
    
    # Ensure the preferences belong to the current user
    if preferences.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update these preferences"
        )
    
    # Update preferences
    preferences.focus_areas = preferences_data.focus_areas
    preferences.keywords = preferences_data.keywords
    preferences.subject_preferences = preferences_data.subject_preferences
    
    db.commit()
    db.refresh(preferences)
    
    return preferences

