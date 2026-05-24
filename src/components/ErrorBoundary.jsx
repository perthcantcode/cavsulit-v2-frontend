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
            className="px-6 py-3 rounded-full bg-[#16a34a] text-white font-semibold hover:shadow-glow-green mb-6"
          >
            Retry
          </button>
          {this.state.error && (
            <pre className="text-xs rounded-xl p-4 max-w-lg overflow-auto text-left" style={{ color: 'var(--text-muted)', background: 'var(--bg-alt)', border: '1px solid var(--border)' }}>
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
