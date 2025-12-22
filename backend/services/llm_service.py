import os
from typing import List
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
    
    def rewrite_text(self, original_text: str, keywords: List[str]) -> str:
        """
        Rewrite text to incorporate keywords more frequently
        
        Args:
            original_text: The original text to rewrite
            keywords: List of keywords to incorporate
            
        Returns:
            Rewritten text with keywords incorporated
        """
        if not self.client:
            # Fallback for testing/development
            # In production, this should raise an error or use a fallback
            return self._mock_rewrite(original_text, keywords)
        
        # Filter keywords to only those relevant to the content
        relevant_keywords = self._filter_relevant_keywords(original_text, keywords)
        
        if not relevant_keywords:
            # No relevant keywords, return original text
            return original_text
        
        # Create prompt
        keywords_str = ", ".join(relevant_keywords[:5])  # Limit to 5 most relevant
        prompt = f"""Rewrite the following text to naturally incorporate ONLY the relevant educational keywords: {keywords_str}
IMPORTANT: Only use keywords that are actually relevant to the content. Do not force unrelated keywords.
Maintain the original tone, style, and meaning. The rewritten text should feel natural and authentic.
Original text: {original_text}"""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that rewrites text to incorporate ONLY relevant educational keywords naturally. If keywords are not relevant to the content, do not use them. Always preserve the original tone, style, and meaning."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            # Fallback to mock if API call fails
            return self._mock_rewrite(original_text, keywords)
    
    def _mock_rewrite(self, original_text: str, keywords: List[str]) -> str:
        """
        Mock rewrite function for testing/development
        Intelligently selects and incorporates relevant keywords
        """
        if not keywords:
            return original_text
        
        # Find relevant keywords that match the content theme
        text_lower = original_text.lower()
        relevant_keywords = []
        
        # Education/learning related keywords
        education_terms = ['reading', 'writing', 'learning', 'education', 'study', 'teach', 
                          'learn', 'book', 'literature', 'language', 'vocabulary', 'comprehension',
                          '阅读', '写作', '学习', '教育', '读书', '文学', '语言', '词汇']
        
        # Check if text is education-related
        is_education_related = any(term in text_lower for term in education_terms)
        
        if not is_education_related:
            # If content is not education-related, don't force keywords
            return original_text
        
        # Select keywords that are relevant to the content
        for keyword in keywords:
            keyword_lower = keyword.lower()
            # Match if keyword is mentioned or related to education/learning themes
            if any(term in keyword_lower for term in ['reading', 'writing', 'literature', 'language', 
                    'vocabulary', 'comprehension', 'learning', 'education', 'study',
                    '阅读', '写作', '文学', '语言', '学习', '教育']):
                if keyword not in relevant_keywords:
                    relevant_keywords.append(keyword)
                    if len(relevant_keywords) >= 2:  # Limit to 2 most relevant
                        break
        
        # If no relevant keywords found, try to use general education keywords
        if not relevant_keywords:
            for keyword in keywords:
                if any(term in keyword.lower() for term in ['curriculum', 'grade', 'level', 'skill', 
                        '课程', '年级', '技能']):
                    relevant_keywords.append(keyword)
                    if len(relevant_keywords) >= 2:
                        break
        
        # If still no relevant keywords, don't modify
        if not relevant_keywords:
            return original_text
        
        # Naturally incorporate keywords into the text
        # For Chinese text, add keywords in a natural way
        if any('\u4e00' <= char <= '\u9fff' for char in original_text):
            # Chinese text - incorporate keywords naturally
            keyword_phrases = []
            for kw in relevant_keywords[:2]:
                if 'reading' in kw.lower() or '阅读' in kw:
                    keyword_phrases.append("提升阅读能力")
                elif 'writing' in kw.lower() or '写作' in kw:
                    keyword_phrases.append("加强写作技巧")
                elif 'vocabulary' in kw.lower() or '词汇' in kw:
                    keyword_phrases.append("扩展词汇量")
                elif 'literature' in kw.lower() or '文学' in kw:
                    keyword_phrases.append("文学素养")
                elif 'language' in kw.lower() or '语言' in kw:
                    keyword_phrases.append("语言能力")
            
            if keyword_phrases:
                # Add naturally at the end
                addition = f" 通过这种方式，我们可以更好地{keyword_phrases[0]}。"
                return original_text + addition
        else:
            # English text - incorporate keywords naturally
            keyword_phrases = []
            for kw in relevant_keywords[:2]:
                if 'reading' in kw.lower():
                    keyword_phrases.append("improve reading skills")
                elif 'writing' in kw.lower():
                    keyword_phrases.append("enhance writing abilities")
                elif 'vocabulary' in kw.lower():
                    keyword_phrases.append("expand vocabulary")
                elif 'literature' in kw.lower():
                    keyword_phrases.append("literary appreciation")
            
            if keyword_phrases:
                addition = f" This helps us {keyword_phrases[0]}."
                return original_text + addition
        
        # Fallback: return original if no good match
        return original_text
    
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

