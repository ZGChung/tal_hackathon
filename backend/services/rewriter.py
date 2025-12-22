from typing import List
from backend.services.llm_service import LLMService


class RewriterService:
    """Service for rewriting text with curriculum alignment"""
    
    def __init__(self):
        """Initialize rewriter service"""
        self.llm_service = LLMService()
    
    def rewrite(
        self,
        original_text: str,
        curriculum_keywords: List[str],
        preference_keywords: List[str]
    ) -> str:
        """
        Rewrite text incorporating curriculum and preference keywords
        
        Args:
            original_text: The original text to rewrite
            curriculum_keywords: Keywords from curriculum
            preference_keywords: Keywords from admin preferences
            
        Returns:
            Rewritten text
        """
        # Combine keywords, removing duplicates
        all_keywords = list(set(curriculum_keywords + preference_keywords))
        
        # Call LLM service to rewrite
        rewritten_text = self.llm_service.rewrite_text(
            original_text=original_text,
            keywords=all_keywords
        )
        
        return rewritten_text

