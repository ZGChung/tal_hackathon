import os
from typing import List, Tuple
from openai import OpenAI


class LLMService:
    """Service for interacting with LLM (OpenAI) for text rewriting"""
    
    def __init__(self):
        """Initialize LLM service with API key from environment"""
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            self.client = OpenAI(api_key=api_key)
        else:
            # For testing/development without API key
            self.client = None
    
    def rewrite_text(self, original_text: str, keywords: List[str]) -> Tuple[str, List[str]]:
        """
        Rewrite text to incorporate keywords more frequently
        
        Args:
            original_text: The original text to rewrite
            keywords: List of keywords to incorporate
            
        Returns:
            Tuple of (rewritten_text, keywords_used)
        """
        if not self.client:
            # Fallback for testing/development
            # In production, this should raise an error or use a fallback
            return self._mock_rewrite(original_text, keywords)
        
        # Use all keywords (mock posts are already education-related)
        # Create prompt
        keywords_str = ", ".join(keywords[:10])  # Use up to 10 keywords
        prompt = f"""Rewrite the following text to naturally incorporate ONLY the relevant educational keywords: {keywords_str}
IMPORTANT: Only use keywords that are actually relevant to the content. Do not force unrelated keywords.
Maintain the original tone, style, and meaning. The rewritten text should feel natural and authentic.
Original text: {original_text}"""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that rewrites educational content to naturally incorporate relevant keywords. Only use keywords that make sense in context. Always preserve the original tone, style, and meaning."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            rewritten = response.choices[0].message.content.strip()
            # Extract keywords that were actually used (simple heuristic)
            keywords_used = self._extract_used_keywords(rewritten, keywords)
            return rewritten, keywords_used
        except Exception as e:
            # Fallback to mock if API call fails
            return self._mock_rewrite(original_text, keywords)
    
    def _mock_rewrite(self, original_text: str, keywords: List[str]) -> Tuple[str, List[str]]:
        """
        Mock rewrite function for testing/development
        Naturally incorporates relevant keywords into the text
        """
        if not keywords:
            return original_text
        
        # Select 2-3 most relevant keywords (prioritize education-related ones)
        relevant_keywords = []
        text_lower = original_text.lower()
        
        # Priority keywords that match common curriculum topics
        priority_terms = {
            'reading': ['reading', '阅读', 'literature', '文学', 'comprehension', '理解'],
            'writing': ['writing', '写作', 'composition', 'composition'],
            'vocabulary': ['vocabulary', '词汇', 'word', '单词'],
            'language': ['language', '语言', 'linguistics', '语言学'],
            'learning': ['learning', '学习', 'study', 'education', '教育']
        }
        
        # Find matching keywords
        for keyword in keywords[:10]:  # Check first 10 keywords
            keyword_lower = keyword.lower()
            for category, terms in priority_terms.items():
                if any(term in keyword_lower for term in terms):
                    if keyword not in relevant_keywords:
                        relevant_keywords.append(keyword)
                        break
            if len(relevant_keywords) >= 2:
                break
        
        # If no priority matches, use first 2 keywords
        if not relevant_keywords and keywords:
            relevant_keywords = keywords[:2]
        
        # Naturally incorporate keywords into Chinese text
        if any('\u4e00' <= char <= '\u9fff' for char in original_text):
            # Map keywords to natural Chinese phrases
            additions = []
            for kw in relevant_keywords[:2]:
                kw_lower = kw.lower()
                if 'reading' in kw_lower or '阅读' in kw_lower or 'literature' in kw_lower or '文学' in kw_lower:
                    additions.append("提升阅读能力和文学素养")
                elif 'writing' in kw_lower or '写作' in kw_lower:
                    additions.append("加强写作技巧")
                elif 'vocabulary' in kw_lower or '词汇' in kw_lower:
                    additions.append("扩展词汇量")
                elif 'language' in kw_lower or '语言' in kw_lower:
                    additions.append("提高语言表达能力")
                elif 'learning' in kw_lower or '学习' in kw_lower or 'education' in kw_lower or '教育' in kw_lower:
                    additions.append("促进学习效果")
            
            if additions:
                # Add naturally to the text
                rewritten = f"{original_text} 通过这种方式，我们可以{additions[0]}。"
                return rewritten, relevant_keywords
            else:
                # Generic addition if no specific match
                rewritten = f"{original_text} 这有助于我们更好地学习和成长。"
                return rewritten, relevant_keywords[:1] if relevant_keywords else []
        else:
            # English text
            additions = []
            for kw in relevant_keywords[:2]:
                kw_lower = kw.lower()
                if 'reading' in kw_lower or 'literature' in kw_lower:
                    additions.append("improve reading skills and literary appreciation")
                elif 'writing' in kw_lower:
                    additions.append("enhance writing abilities")
                elif 'vocabulary' in kw_lower:
                    additions.append("expand vocabulary")
                elif 'language' in kw_lower:
                    additions.append("develop language skills")
            
            if additions:
                rewritten = f"{original_text} This helps us {additions[0]}."
                return rewritten, relevant_keywords
            else:
                rewritten = f"{original_text} This contributes to our learning and growth."
                return rewritten, relevant_keywords[:1] if relevant_keywords else []
    
    def _filter_relevant_keywords(self, text: str, keywords: List[str]) -> List[str]:
        """
        Filter keywords to only those relevant to the content
        
        Args:
            text: The original text
            keywords: List of all keywords
            
        Returns:
            List of relevant keywords
        """
        if not keywords:
            return []
        
        text_lower = text.lower()
        relevant = []
        
        # Education/learning related terms
        education_terms = ['reading', 'writing', 'learning', 'education', 'study', 'teach', 
                          'learn', 'book', 'literature', 'language', 'vocabulary', 'comprehension',
                          '阅读', '写作', '学习', '教育', '读书', '文学', '语言', '词汇', '历史',
                          '科学', '数学', '艺术', '文化', '思维', '分析', '理解']
        
        # Check if text is education-related
        is_education_related = any(term in text_lower for term in education_terms)
        
        if not is_education_related:
            return []  # Don't use keywords if content is not education-related
        
        # Match keywords that relate to the content theme
        for keyword in keywords:
            keyword_lower = keyword.lower()
            # Check if keyword is relevant
            if any(term in keyword_lower for term in education_terms):
                relevant.append(keyword)
        
        return relevant[:5]  # Limit to 5 most relevant
    
    def _extract_used_keywords(self, rewritten_text: str, all_keywords: List[str]) -> List[str]:
        """
        Extract keywords that were actually used in the rewritten text
        
        Args:
            rewritten_text: The rewritten text
            all_keywords: All available keywords
            
        Returns:
            List of keywords that appear in the rewritten text
        """
        if not all_keywords:
            return []
        
        rewritten_lower = rewritten_text.lower()
        used_keywords = []
        
        for keyword in all_keywords:
            keyword_lower = keyword.lower()
            # Check if keyword or its variations appear in the text
            if keyword_lower in rewritten_lower:
                used_keywords.append(keyword)
            else:
                # Check for partial matches (for Chinese keywords)
                for word in keyword_lower.split():
                    if len(word) > 2 and word in rewritten_lower:
                        used_keywords.append(keyword)
                        break
        
        return used_keywords[:5]  # Limit to 5 most relevant

