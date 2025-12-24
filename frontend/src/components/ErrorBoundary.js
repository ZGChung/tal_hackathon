import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Optionally reload the page
    if (this.props.resetOnError) {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div style={{
          padding: '2rem',
          maxWidth: '600px',
          margin: '2rem auto',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: '#fff',
        }}>
          <h2 style={{ color: '#d32f2f', marginTop: 0 }}>⚠️ 出现了问题</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            发生了意外错误。请尝试刷新页面。
          </p>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                错误详情（仅开发模式）
              </summary>
              <pre style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                margin: 0,
                color: '#d32f2f',
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '0.5rem',
              }}
            >
              重试
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              返回首页
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

