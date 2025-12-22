import os
import re
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
        Naturally incorporates relevant keywords by paraphrasing and polishing the text
        """
        if not keywords:
            return original_text, []
        
        # Select 2-3 most relevant keywords that can be naturally integrated
        relevant_keywords = []
        text_lower = original_text.lower()
        
        # Find keywords that can be naturally incorporated
        # Prioritize concrete words (nouns, adjectives) over abstract concepts
        for keyword in keywords[:15]:  # Check first 15 keywords
            keyword_lower = keyword.lower().strip()
            # Skip if keyword is too generic or already in text
            if len(keyword_lower) < 3 or keyword_lower in text_lower:
                continue
            
            # Prefer concrete vocabulary words (single words, not phrases)
            if len(keyword.split()) == 1 and keyword_lower not in ['and', 'the', 'for', 'with', 'from']:
                # Check if keyword can be naturally integrated
                if self._can_integrate_keyword(original_text, keyword):
                    relevant_keywords.append(keyword)
                    if len(relevant_keywords) >= 3:
                        break
        
        # If no single-word keywords found, try 2-word phrases
        if len(relevant_keywords) < 2:
            for keyword in keywords[:15]:
                keyword_lower = keyword.lower().strip()
                if len(keyword.split()) == 2 and keyword_lower not in text_lower:
                    if self._can_integrate_keyword(original_text, keyword):
                        relevant_keywords.append(keyword)
                        if len(relevant_keywords) >= 3:
                            break
        
        # If no relevant keywords found, still try to use first few keywords
        if not relevant_keywords and keywords:
            # Use first 2-3 keywords that are single words
            for keyword in keywords[:10]:
                keyword_lower = keyword.lower().strip()
                if len(keyword.split()) == 1 and len(keyword_lower) >= 3:
                    relevant_keywords.append(keyword)
                    if len(relevant_keywords) >= 2:
                        break
        
        # Always ensure we have at least one keyword to work with
        if not relevant_keywords and keywords:
            relevant_keywords = [keywords[0]]
        
        # Rewrite by paraphrasing and incorporating keywords naturally
        rewritten = self._paraphrase_with_keywords(original_text, relevant_keywords)
        
        # Ensure text was actually modified
        if rewritten == original_text and relevant_keywords:
            # Force a modification by adding keyword naturally
            first_keyword = relevant_keywords[0]
            rewritten = original_text.replace('.', f' This relates to {first_keyword}.', 1)
            if rewritten == original_text:
                rewritten = f"{original_text} This connects to {first_keyword}."
        
        return rewritten, relevant_keywords
    
    def _can_integrate_keyword(self, text: str, keyword: str) -> bool:
        """Check if a keyword can be naturally integrated into the text"""
        keyword_lower = keyword.lower()
        text_lower = text.lower()
        
        # Don't use if already present
        if keyword_lower in text_lower:
            return False
        
        # Check if keyword relates to common themes in educational content
        educational_themes = [
            'reading', 'writing', 'learning', 'study', 'book', 'literature',
            'vocabulary', 'language', 'comprehension', 'analysis', 'thinking',
            'creative', 'explore', 'discover', 'adventure', 'journey',
            'bright', 'shiny', 'playful', 'curious', 'wisdom', 'courage',
            'silver', 'gold', 'wind', 'rain', 'storm', 'harmony', 'rhythm'
        ]
        
        # Accept if keyword matches educational themes or is a concrete noun/adjective
        return any(theme in keyword_lower for theme in educational_themes) or len(keyword.split()) == 1
    
    def _paraphrase_with_keywords(self, text: str, keywords: List[str]) -> str:
        """Paraphrase text while naturally incorporating keywords"""
        if not keywords:
            return text
        
        original_text = text
        words = text.split()
        rewritten_words = []
        keywords_used = []
        
        # More aggressive replacement patterns
        adjective_replacements = {
            'amazing': ['bright', 'shiny', 'playful', 'creative', 'curious'],
            'great': ['creative', 'curious', 'bright'],
            'good': ['gentle', 'warm', 'playful'],
            'beautiful': ['bright', 'shiny', 'playful'],
            'interesting': ['curious', 'playful', 'creative'],
            'fun': ['playful', 'creative', 'curious'],
            'incredible': ['bright', 'shiny', 'playful'],
            'wonderful': ['bright', 'playful', 'creative'],
            'fantastic': ['bright', 'creative', 'curious'],
        }
        
        noun_replacements = {
            'trip': ['journey', 'adventure', 'discovery'],
            'story': ['adventure', 'journey', 'discovery'],
            'finding': ['discovery', 'adventure'],
            'balance': ['harmony', 'rhythm'],
            'beat': ['rhythm', 'harmony'],
            'knowledge': ['wisdom', 'courage'],
            'bravery': ['courage', 'wisdom'],
            'experience': ['adventure', 'journey', 'discovery'],
        }
        
        # First pass: aggressive word replacement
        i = 0
        while i < len(words):
            word = words[i]
            word_clean = word.strip('.,!?;:')
            word_lower = word_clean.lower()
            replaced = False
            
            # Try adjective replacement
            if word_lower in adjective_replacements:
                for keyword in keywords:
                    kw_lower = keyword.lower()
                    if kw_lower in adjective_replacements[word_lower] and kw_lower not in keywords_used:
                        # Preserve capitalization and punctuation
                        if word[0].isupper():
                            rewritten_words.append(keyword.capitalize() + word[len(word_clean):])
                        else:
                            rewritten_words.append(keyword + word[len(word_clean):])
                        keywords_used.append(kw_lower)
                        replaced = True
                        break
            
            # Try noun replacement
            if not replaced and word_lower in noun_replacements:
                for keyword in keywords:
                    kw_lower = keyword.lower()
                    if kw_lower in noun_replacements[word_lower] and kw_lower not in keywords_used:
                        if word[0].isupper():
                            rewritten_words.append(keyword.capitalize() + word[len(word_clean):])
                        else:
                            rewritten_words.append(keyword + word[len(word_clean):])
                        keywords_used.append(kw_lower)
                        replaced = True
                        break
            
            # Try adding adjectives before nouns
            if not replaced and i < len(words) - 1:
                next_word = words[i + 1].lower().strip('.,!?;:')
                if next_word in ['book', 'novel', 'story', 'journey', 'experience', 'learning', 'adventure', 'reading', 'writing', 'practice', 'method', 'routine']:
                    for keyword in keywords:
                        kw_lower = keyword.lower()
                        if kw_lower in ['bright', 'playful', 'creative', 'curious', 'gentle', 'swift', 'warm'] and kw_lower not in keywords_used:
                            rewritten_words.append(keyword)
                            keywords_used.append(kw_lower)
                            replaced = True
                            break
            
            if not replaced:
                rewritten_words.append(word)
            
            i += 1
        
        rewritten = ' '.join(rewritten_words)
        
        # Second pass: add remaining keywords in natural positions
        for keyword in keywords:
            if keyword.lower() not in keywords_used:
                kw_lower = keyword.lower()
                # Add before common nouns
                insertion_points = [
                    ('the book', f'the {keyword} book'),
                    ('this book', f'this {keyword} book'),
                    ('a book', f'a {keyword} book'),
                    ('my reading', f'my {keyword} reading'),
                    ('the learning', f'the {keyword} learning'),
                    ('this experience', f'this {keyword} experience'),
                    ('so much', f'{keyword} and so much'),
                    ('really helps', f'really helps with {keyword}'),
                ]
                
                for pattern, replacement in insertion_points:
                    if pattern in rewritten.lower() and kw_lower not in keywords_used:
                        # Case-insensitive replace
                        rewritten = re.sub(re.escape(pattern), replacement, rewritten, flags=re.IGNORECASE, count=1)
                        keywords_used.append(kw_lower)
                        break
        
        # Third pass: if still no keywords used, force insertion
        if not keywords_used:
            first_keyword = keywords[0]
            # Insert at natural break points
            if '!' in rewritten:
                rewritten = rewritten.replace('!', f' This {first_keyword} experience!', 1)
            elif '.' in rewritten:
                rewritten = rewritten.replace('.', f' This relates to {first_keyword}.', 1)
            else:
                rewritten = f"{rewritten} This connects to {first_keyword}."
            keywords_used.append(first_keyword.lower())
        
        # Clean up
        rewritten = rewritten.replace('  ', ' ').strip()
        
        # Ensure text was actually modified
        if rewritten == original_text:
            # Force modification by adding keyword phrase
            first_keyword = keywords[0]
            if rewritten.endswith('!'):
                rewritten = rewritten[:-1] + f' This {first_keyword} journey!' 
            elif rewritten.endswith('.'):
                rewritten = rewritten[:-1] + f' This {first_keyword} experience.'
            else:
                rewritten = f"{rewritten} This {first_keyword} learning journey."
        
        return rewritten
    
    def _is_adjective_context(self, word: str, words: List[str], index: int) -> bool:
        """Check if word is in an adjective context"""
        if index > 0:
            prev_word = words[index - 1].lower().strip('.,!?;:')
            if prev_word in ['is', 'are', 'was', 'were', 'seems', 'looks', 'feels', 'very', 'really', 'so', 'quite']:
                return True
        return False
    
    def _is_noun_context(self, word: str, words: List[str], index: int) -> bool:
        """Check if word is in a noun context"""
        if index > 0:
            prev_word = words[index - 1].lower().strip('.,!?;:')
            if prev_word in ['the', 'a', 'an', 'this', 'that', 'my', 'our', 'your']:
                return True
        return False
    
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

