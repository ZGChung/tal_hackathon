from fastapi import APIRouter, HTTPException, status
from typing import List
from backend.services.mock_rednote import MockRedNoteAdapter
from backend.schemas.post import Post

router = APIRouter(prefix="/api/rednote", tags=["rednote"])

# Initialize adapter (in production, this would be injected via dependency)
_adapter = MockRedNoteAdapter()


@router.get("/feed", response_model=List[Post])
async def get_feed():
    """Get feed of RedNote posts"""
    try:
        feed = _adapter.get_feed()
        return feed
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch feed: {str(e)}"
        )


@router.get("/posts/{post_id}", response_model=Post)
async def get_post(post_id: str):
    """Get a single RedNote post by ID"""
    try:
        post = _adapter.get_post(post_id)
        return post
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch post: {str(e)}"
        )

