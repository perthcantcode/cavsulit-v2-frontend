import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('CavSulit ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--bg)' }}>
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text)' }}>Something went wrong</h1>
          <p className="mb-6 max-w-md" style={{ color: 'var(--text-muted)' }}>
            The server might be waking up. Try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-primary mb-6"
          >
            Retry
          </button>
          {this.state.error && (
            <pre className="text-xs p-4 max-w-lg overflow-auto text-left" style={{ color: 'var(--text-muted)', background: 'var(--bg-alt)', border: '2px solid #1a1a1a', boxShadow: '5px 5px 0px #1a1a1a' }}>
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
