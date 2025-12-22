from abc import ABC, abstractmethod
from typing import List
from backend.schemas.post import Post


class PlatformAdapter(ABC):
    """Abstract interface for platform adapters (RedNote, Weibo, etc.)"""
    
    @abstractmethod
    def get_feed(self) -> List[Post]:
        """Get feed of posts from the platform"""
        pass
    
    @abstractmethod
    def get_post(self, post_id: str) -> Post:
        """Get a single post by ID"""
        pass

