import React from 'react';

function checkIsChunkError(error) {
  if (!error) return false;
  const errorStr = typeof error === 'string' ? error : (error.message || error.toString() || '');
  return (
    errorStr.includes('Failed to fetch dynamically imported module') ||
    errorStr.includes('Importing a module script failed') ||
    errorStr.includes('dynamically imported module') ||
    errorStr.includes('Loading chunk')
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, isChunkError: false };
  }

  static getDerivedStateFromError(error) {
    const isChunkError = checkIsChunkError(error);
    return { hasError: true, error, isChunkError };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    const isChunkError = checkIsChunkError(error);

    if (isChunkError) {
      const lastReload = sessionStorage.getItem('chunk_error_auto_reload');
      const now = Date.now();
      // If we haven't reloaded automatically in the last 15 seconds, reload page to fetch latest deployed assets
      if (!lastReload || now - parseInt(lastReload, 10) > 15000) {
        sessionStorage.setItem('chunk_error_auto_reload', now.toString());
        window.location.reload();
        return;
      }
    }

    this.setState({
      error: error,
      errorInfo: errorInfo,
      isChunkError
    });
  }

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.isChunkError || checkIsChunkError(this.state.error);

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
          <div className="bg-white p-8 max-w-lg w-full border border-black/10 shadow-sm space-y-4">
            <h1 className="text-2xl font-serif text-red-600 mb-2">
              {isChunkError ? 'New Update Available' : 'Oops! Something went wrong.'}
            </h1>
            <p className="text-sm font-sans text-gray-700">
              {isChunkError
                ? 'A new version of the website has been deployed. Please click below to refresh and load the latest version.'
                : 'An unexpected error has occurred in the application. Please try refreshing the page.'}
            </p>
            {this.state.error && (
              <div className="mt-4 p-4 bg-red-50 overflow-auto max-h-48 text-xs text-red-800 font-mono">
                <p className="font-bold mb-2">{this.state.error.toString()}</p>
                {this.state.errorInfo?.componentStack && (
                  <p className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</p>
                )}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-black text-white py-3 text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
