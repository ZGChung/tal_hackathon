"""
Admin endpoint to manually trigger database seeding
Useful for testing and ensuring curricula are created
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.utils.dependencies import get_admin_user
from backend.models.user import User
from backend.database_seed import seed_database

router = APIRouter(prefix="/api/seed", tags=["seed"])


@router.post("/run", status_code=status.HTTP_200_OK)
async def run_seed(
    current_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Manually trigger database seeding (Admin only)"""
    try:
        seed_database()
        return {"message": "Database seeding completed successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Seeding failed: {str(e)}"
        )

