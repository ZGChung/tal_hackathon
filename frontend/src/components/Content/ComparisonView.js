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

// Compute diff at sentence/clause level for better readability
const computeDiff = (original, rewritten) => {
  const result = [];
  
  // First, try sentence-level comparison
  const originalSentences = splitIntoSentences(original);
  const rewrittenSentences = splitIntoSentences(rewritten);
  
  let origIdx = 0;
  let rewriteIdx = 0;
  
  while (origIdx < originalSentences.length || rewriteIdx < rewrittenSentences.length) {
    if (origIdx >= originalSentences.length) {
      // Only in rewritten - entire sentence added
      result.push({ type: 'added', text: rewrittenSentences[rewriteIdx] });
      rewriteIdx++;
    } else if (rewriteIdx >= rewrittenSentences.length) {
      // Only in original - entire sentence removed
      result.push({ type: 'removed', text: originalSentences[origIdx] });
      origIdx++;
    } else {
      const origSentence = originalSentences[origIdx].trim();
      const rewriteSentence = rewrittenSentences[rewriteIdx].trim();
      
      // Normalize for comparison (remove extra spaces)
      const origNormalized = origSentence.replace(/\s+/g, ' ');
      const rewriteNormalized = rewriteSentence.replace(/\s+/g, ' ');
      
      if (origNormalized === rewriteNormalized) {
        // Same sentence
        result.push({ type: 'unchanged', text: origSentence + ' ' });
        origIdx++;
        rewriteIdx++;
      } else {
        // Different sentences - try clause-level comparison
        const origClauses = splitIntoClauses(origSentence);
        const rewriteClauses = splitIntoClauses(rewriteSentence);
        
        if (origClauses.length === 1 && rewriteClauses.length === 1) {
          // Single clause - entire sentence is different
          result.push({ type: 'removed', text: origSentence + ' ' });
          result.push({ type: 'added', text: rewriteSentence + ' ' });
          origIdx++;
          rewriteIdx++;
        } else {
          // Multiple clauses - compare at clause level
          let origClauseIdx = 0;
          let rewriteClauseIdx = 0;
          
          while (origClauseIdx < origClauses.length || rewriteClauseIdx < rewriteClauses.length) {
            if (origClauseIdx >= origClauses.length) {
              // Only in rewritten
              result.push({ type: 'added', text: rewriteClauses[rewriteClauseIdx] });
              rewriteClauseIdx++;
            } else if (rewriteClauseIdx >= rewriteClauses.length) {
              // Only in original
              result.push({ type: 'removed', text: origClauses[origClauseIdx] });
              origClauseIdx++;
            } else {
              const origClause = origClauses[origClauseIdx].trim();
              const rewriteClause = rewriteClauses[rewriteClauseIdx].trim();
              
              const origClauseNorm = origClause.replace(/\s+/g, ' ');
              const rewriteClauseNorm = rewriteClause.replace(/\s+/g, ' ');
              
              if (origClauseNorm === rewriteClauseNorm) {
                // Same clause
                result.push({ type: 'unchanged', text: origClause });
                origClauseIdx++;
                rewriteClauseIdx++;
              } else {
                // Different clauses
                result.push({ type: 'removed', text: origClause });
                result.push({ type: 'added', text: rewriteClause });
                origClauseIdx++;
                rewriteClauseIdx++;
              }
            }
          }
          
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

