import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { I18nProvider } from './I18nContext'
import { PrefsProvider } from './PrefsContext'
import { LanguageProvider } from './context/LanguageContext'

import { AuthProvider } from './context/AuthContext'
import { flushWhenOnline } from './lib/offlineStore'

class RootErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('RootErrorBoundary caught error:', error);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      });
    }
    if (window.caches) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
  }

  handleReload = () => {
    sessionStorage.setItem('ss-force-clean', '1');
    const path = window.location.pathname || '/';
    window.location.replace(`${path}${path.includes('?') ? '&' : '?'}reset=${Date.now()}`);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'radial-gradient(circle at 50% 20%, #eef4f0 0%, #e2ece6 100%)',
          color: '#176b58',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(23, 107, 88, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            marginBottom: '16px',
          }}>🌿</div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px', color: '#14352c' }}>
            स्मृति सारथी — Smriti Saarthi
          </h1>
          <p style={{ fontSize: '14px', color: '#4a6b62', margin: '0 0 24px', maxWidth: '320px', lineHeight: 1.5 }}>
            ऐप को नवीनतम और सुरक्षित रूप से लोड करने के लिए कृपया नीचे दबाएँ।
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                background: '#176b58',
                color: '#ffffff',
                border: 'none',
                borderRadius: '999px',
                padding: '12px 28px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(23, 107, 88, 0.35)',
              }}
            >
              ऐप रिफ्रेश करें • Reload
            </button>
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem('ss-force-clean', '1');
                window.location.replace(`/user?reset=${Date.now()}`);
              }}
              style={{
                background: 'transparent',
                color: '#176b58',
                border: '1px solid #176b58',
                borderRadius: '999px',
                padding: '10px 24px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              सीधे ऐप खोलें • Open Patient App
            </button>
          </div>
          {this.state.error && (
            <details style={{ marginTop: '20px', fontSize: '11px', color: '#688c81', maxWidth: '320px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', textAlign: 'center', fontWeight: 600 }}>तकनीकी विवरण • Details</summary>
              <pre style={{ marginTop: '8px', padding: '8px', background: 'rgba(0,0,0,0.04)', borderRadius: '6px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {String(this.state.error?.message || this.state.error || '')}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <BrowserRouter>
        <I18nProvider>
          <LanguageProvider>
            <PrefsProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </PrefsProvider>
          </LanguageProvider>
        </I18nProvider>
      </BrowserRouter>
    </RootErrorBoundary>
  </StrictMode>,
)

if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    if (import.meta.env.DEV) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
      if (window.caches) {
        caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
      }
      return;
    }
    navigator.serviceWorker.register('/sw.js').catch(() => {});
    flushWhenOnline();
  });
  window.addEventListener('online', () => { flushWhenOnline(); });
}
