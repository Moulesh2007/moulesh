import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './src/App.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './src/theme.js';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'leaflet/dist/leaflet.css';
import './src/index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: '#E6EDF3', padding: '40px', background: '#0D1117', minHeight: '100vh', fontFamily: 'Roboto, sans-serif' }}>
          <h2 style={{ color: '#FF6F00' }}>⚠️ Something went wrong</h2>
          <pre style={{ color: '#8B949E', fontSize: '0.85rem' }}>{this.state.error?.toString()}</pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 16, padding: '10px 24px', background: '#FF6F00', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id'}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </ErrorBoundary>
);