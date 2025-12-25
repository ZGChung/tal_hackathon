import React from 'react';
import './ComparisonView.css';

// Split text into sentences (highest level)
const splitIntoSentences = (text) => {
  // Split by sentence endings: . ! ? followed by space or end
  return text.split(/([.!?]\s+|[.!?]$)/).filter(s => s.trim().length > 0);
};

// Split text into clauses (second level - by commas, semicolons)
const splitIntoClauses = (text) => {
  // Split by commas, semicolons, and colons
  return text.split(/([,;:]\s+)/).filter(s => s.trim().length > 0);
};

// Compute diff highlighting only the keywords that were used
const computeDiff = (original, rewritten, keywordsUsed = []) => {
  const result = [];
  
  // If no keywords were used, show full diff
  if (!keywordsUsed || keywordsUsed.length === 0) {
    // Fallback to sentence-level diff
    const originalSentences = splitIntoSentences(original);
    const rewrittenSentences = splitIntoSentences(rewritten);
    
    let origIdx = 0;
    let rewriteIdx = 0;
    
    while (origIdx < originalSentences.length || rewriteIdx < rewrittenSentences.length) {
      if (origIdx >= originalSentences.length) {
        result.push({ type: 'added', text: rewrittenSentences[rewriteIdx] });
        rewriteIdx++;
      } else if (rewriteIdx >= rewrittenSentences.length) {
        result.push({ type: 'removed', text: originalSentences[origIdx] });
        origIdx++;
      } else {
        const origSentence = originalSentences[origIdx].trim();
        const rewriteSentence = rewrittenSentences[rewriteIdx].trim();
        
        if (origSentence === rewriteSentence) {
          result.push({ type: 'unchanged', text: origSentence + ' ' });
        } else {
          result.push({ type: 'removed', text: origSentence + ' ' });
          result.push({ type: 'added', text: rewriteSentence + ' ' });
        }
        origIdx++;
        rewriteIdx++;
      }
    }
    return result;
  }
  
  // Highlight only the keywords that were used
  // Find all occurrences of keywords in the rewritten text
  // Sort keywords by length (longest first) to match longer phrases first
  const sortedKeywords = [...keywordsUsed].sort((a, b) => b.length - a.length);
  
  // Find all keyword positions in rewritten text
  const keywordMatches = [];
  for (const keyword of sortedKeywords) {
    // Escape special regex characters
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedKeyword, 'g');
    let match;
    while ((match = regex.exec(rewritten)) !== null) {
      keywordMatches.push({
        keyword: keyword,
        start: match.index,
        end: match.index + match[0].length,
        matchedText: match[0]
      });
    }
  }
  
  // Sort matches by position
  keywordMatches.sort((a, b) => a.start - b.start);
  
  // Remove overlapping matches (keep the first/longest one)
  const nonOverlappingMatches = [];
  for (const match of keywordMatches) {
    const overlaps = nonOverlappingMatches.some(existing => 
      (match.start < existing.end && match.end > existing.start)
    );
    if (!overlaps) {
      nonOverlappingMatches.push(match);
    }
  }
  
  // Build result by highlighting only keywords
  let currentPos = 0;
  for (const match of nonOverlappingMatches) {
    // Add unchanged text before keyword
    if (match.start > currentPos) {
      const unchangedText = rewritten.substring(currentPos, match.start);
      if (unchangedText) {
        result.push({ type: 'unchanged', text: unchangedText });
      }
    }
    
    // Add highlighted keyword
    result.push({ type: 'added', text: match.matchedText });
    
    currentPos = match.end;
  }
  
  // Add remaining unchanged text
  if (currentPos < rewritten.length) {
    const remainingText = rewritten.substring(currentPos);
    if (remainingText) {
      result.push({ type: 'unchanged', text: remainingText });
    }
  }
  
  // If no keywords found, show full rewritten text as unchanged
  if (result.length === 0) {
    result.push({ type: 'unchanged', text: rewritten });
  }
  
  return result;
};

const ComparisonView = ({ post, rewriteData, onClose }) => {
  // Only highlight the keywords that were actually used
  const diff = computeDiff(
    rewriteData.original_text, 
    rewriteData.rewritten_text,
    rewriteData.keywords_used || []
  );

  return (
    <div className="comparison-view-overlay" data-testid="comparison-view">
      <div className="comparison-view-container">
        <div className="comparison-header">
          <h2>内容对比</h2>
          <button className="close-button" onClick={onClose} data-testid="close-button">
            ✕
          </button>
        </div>

        <div className="diff-view">
          <div className="diff-content">
            {diff.map((item, index) => {
              if (item.type === 'removed') {
                return (
                  <span key={index} className="diff-removed">
                    {item.text}
                  </span>
                );
              } else if (item.type === 'added') {
                return (
                  <span key={index} className="diff-added">
                    {item.text}
                  </span>
                );
              } else {
                return (
                  <span key={index} className="diff-unchanged">
                    {item.text}
                  </span>
                );
              }
            })}
          </div>
        </div>

        <div className="keywords-section">
          <h3>重写此内容时使用的关键词</h3>
          <div className="keywords-list">
            {rewriteData.keywords_used && rewriteData.keywords_used.length > 0 ? (
              rewriteData.keywords_used.map((keyword, index) => (
                <span key={index} className="keyword-tag">
                  {keyword}
                </span>
              ))
            ) : (
              <span className="no-keywords">无关键词</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;

