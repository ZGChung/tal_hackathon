import re
from typing import List


def parse_markdown_keywords(content: str) -> List[str]:
    """
    Parse markdown content and extract keywords.
    
    Extracts:
    - Headings (# ## ###) as topics
    - Bold text (**text**) as keywords
    - List items as concepts
    
    Args:
        content: Markdown content as string
        
    Returns:
        List of extracted keywords
    """
    keywords = []
    
    # Extract headings (# ## ###)
    heading_pattern = r'^#{1,3}\s+(.+)$'
    for line in content.split('\n'):
        match = re.match(heading_pattern, line.strip())
        if match:
            heading_text = match.group(1).strip()
            if heading_text:
                keywords.append(heading_text)
    
    # Extract bold text (**text** or __text__)
    bold_pattern = r'\*\*(.+?)\*\*|__(.+?)__'
    bold_matches = re.findall(bold_pattern, content)
    for match in bold_matches:
        # match is a tuple, get the non-empty one
        bold_text = match[0] if match[0] else match[1]
        if bold_text.strip():
            keywords.append(bold_text.strip())
    
    # Extract list items (lines starting with - or *)
    list_pattern = r'^[-*]\s+(.+)$'
    for line in content.split('\n'):
        match = re.match(list_pattern, line.strip())
        if match:
            list_item = match.group(1).strip()
            # Remove bold markers if present
            list_item = re.sub(r'\*\*(.+?)\*\*|__(.+?)__', r'\1\2', list_item)
            # Split by colon if present (e.g., "**Variables**: x, y" -> "Variables", "x", "y")
            if ':' in list_item:
                parts = list_item.split(':', 1)
                keyword_part = parts[0].strip()
                if keyword_part:
                    keywords.append(keyword_part)
                # Also extract comma-separated values after colon
                value_part = parts[1].strip()
                if value_part:
                    for value in value_part.split(','):
                        value = value.strip()
                        if value:
                            keywords.append(value)
            else:
                # Check if list item contains comma-separated words (e.g., "Silver, Gold, Bronze")
                if ',' in list_item:
                    # Split by comma and add each as a separate keyword
                    for item in list_item.split(','):
                        item = item.strip()
                        if item:
                            keywords.append(item)
                else:
                    if list_item:
                        keywords.append(list_item)
    
    # Filter out broad/generic keywords (grade levels, general categories)
    broad_keywords_patterns = [
        r'^(elementary|middle|high)\s*(school)?',
        r'grade[s]?\s*(k-?\d+|\d+-\d+)',
        r'^overview$',
        r'^core components$',
        r'^key concepts$',
        r'^assessment methods$',
        r'^resources$',
        r'^grade levels?$',
        r'^level$',
        r'^process$',
        r'^skills?$',
        r'^genres?$',
        r'^study$',
        r'^development$',
    ]
    
    # Also filter out very long phrases (likely section headers, not specific terms)
    filtered_keywords = []
    for keyword in keywords:
        keyword_lower = keyword.lower().strip()
        # Skip if matches broad patterns
        is_broad = any(re.match(pattern, keyword_lower) for pattern in broad_keywords_patterns)
        # Skip if too long (likely a sentence or description, not a specific term)
        is_too_long = len(keyword) > 50
        # Skip if contains "and" or "or" with multiple words (likely a category)
        is_category = ' and ' in keyword_lower or ' or ' in keyword_lower
        
        if not is_broad and not is_too_long and not is_category:
            # If keyword is already a single word or short phrase, add it directly
            # (comma-separated items are already split in the extraction phase)
            if len(keyword.split()) <= 3:  # Single word or short phrase (max 3 words)
                filtered_keywords.append(keyword)
            else:
                # For longer phrases, extract meaningful individual words
                words = keyword.split()
                for word in words:
                    word = word.strip('.,!?;:')
                    # Only add if it's a meaningful word (not too short, not a stop word)
                    if len(word) > 2 and word.lower() not in ['the', 'and', 'or', 'for', 'with', 'from', 'that', 'this', 'are', 'was', 'were', 'has', 'have', 'had']:
                        filtered_keywords.append(word)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_keywords = []
    for keyword in filtered_keywords:
        keyword_lower = keyword.lower().strip()
        if keyword_lower and keyword_lower not in seen and len(keyword_lower) > 2:
            seen.add(keyword_lower)
            unique_keywords.append(keyword.strip())
    
    return unique_keywords

