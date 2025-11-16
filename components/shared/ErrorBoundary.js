'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-light">
          <div className="card max-w-md text-center">
            <AlertCircle className="w-16 h-16 text-semantic-error mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
            <p className="text-neutral-medium mb-6">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-primary-red text-white px-6 py-2 rounded-lg hover:bg-primary-darkRed transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

