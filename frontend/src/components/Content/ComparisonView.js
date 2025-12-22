import React from 'react';
import './ComparisonView.css';

// Simple diff algorithm to highlight changes
const computeDiff = (original, rewritten) => {
  const result = [];
  const originalWords = original.split(/(\s+|[.,!?;:])/);
  const rewrittenWords = rewritten.split(/(\s+|[.,!?;:])/);
  
  let origIdx = 0;
  let rewriteIdx = 0;
  
  while (origIdx < originalWords.length || rewriteIdx < rewrittenWords.length) {
    if (origIdx >= originalWords.length) {
      // Only in rewritten
      result.push({ type: 'added', text: rewrittenWords[rewriteIdx] });
      rewriteIdx++;
    } else if (rewriteIdx >= rewrittenWords.length) {
      // Only in original
      result.push({ type: 'removed', text: originalWords[origIdx] });
      origIdx++;
    } else if (originalWords[origIdx] === rewrittenWords[rewriteIdx]) {
      // Same word
      result.push({ type: 'unchanged', text: originalWords[origIdx] });
      origIdx++;
      rewriteIdx++;
    } else {
      // Different - try to find next match
      let foundMatch = false;
      for (let lookAhead = 1; lookAhead <= 5 && origIdx + lookAhead < originalWords.length; lookAhead++) {
        if (originalWords[origIdx + lookAhead] === rewrittenWords[rewriteIdx]) {
          // Found match ahead, mark words as removed
          for (let i = 0; i < lookAhead; i++) {
            result.push({ type: 'removed', text: originalWords[origIdx + i] });
          }
          origIdx += lookAhead;
          foundMatch = true;
          break;
        }
      }
      
      if (!foundMatch) {
        // Check if rewritten word appears later in original
        let foundInOriginal = false;
        for (let lookAhead = 1; lookAhead <= 5 && rewriteIdx + lookAhead < rewrittenWords.length; lookAhead++) {
          if (rewrittenWords[rewriteIdx + lookAhead] === originalWords[origIdx]) {
            // Found match ahead in rewritten, mark words as added
            for (let i = 0; i < lookAhead; i++) {
              result.push({ type: 'added', text: rewrittenWords[rewriteIdx + i] });
            }
            rewriteIdx += lookAhead;
            foundInOriginal = true;
            break;
          }
        }
        
        if (!foundInOriginal) {
          // No match found, mark both as changed
          result.push({ type: 'removed', text: originalWords[origIdx] });
          result.push({ type: 'added', text: rewrittenWords[rewriteIdx] });
          origIdx++;
          rewriteIdx++;
        }
      }
    }
  }
  
  return result;
};

const ComparisonView = ({ post, rewriteData, onClose }) => {
  const diff = computeDiff(rewriteData.original_text, rewriteData.rewritten_text);

  return (
    <div className="comparison-view-overlay" data-testid="comparison-view">
      <div className="comparison-view-container">
        <div className="comparison-header">
          <h2>Content Comparison</h2>
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
          <h3>Keywords Used in Rewriting This Content</h3>
          <div className="keywords-list">
            {rewriteData.keywords_used && rewriteData.keywords_used.length > 0 ? (
              rewriteData.keywords_used.map((keyword, index) => (
                <span key={index} className="keyword-tag">
                  {keyword}
                </span>
              ))
            ) : (
              <span className="no-keywords">No keywords</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;

