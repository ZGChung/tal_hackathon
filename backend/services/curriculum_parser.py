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
                if list_item:
                    keywords.append(list_item)
    
    # Remove duplicates while preserving order
    seen = set()
    unique_keywords = []
    for keyword in keywords:
        keyword_lower = keyword.lower()
        if keyword_lower not in seen:
            seen.add(keyword_lower)
            unique_keywords.append(keyword)
    
    return unique_keywords

