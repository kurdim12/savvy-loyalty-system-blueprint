
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { Toaster as SonnerToaster } from 'sonner';

// Create a client
const queryClient = new QueryClient();

console.log('Main.tsx: Application initializing');

// Initialize error logging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Create an error boundary component to catch errors
class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: any, errorInfo: any) {
    console.error('App crashed:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0] p-4">
          <div className="text-center p-6 max-w-md bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-60 text-left">
              <pre className="text-sm text-gray-800">{this.state.error?.toString()}</pre>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#8B4513] text-white rounded hover:bg-[#6F4E37] transition-colors"
            >
              Reload Page
            </button>
            <p className="mt-4 text-sm text-gray-600">
              If the problem persists, please clear your browser cache and try again.
            </p>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <ErrorBoundary>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <SonnerToaster position="top-right" expand={false} richColors />
        <Toaster />
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </ErrorBoundary>
);
