import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { I18nProvider } from './I18nContext'
import { PrefsProvider } from './PrefsContext'
import { LanguageProvider } from './context/LanguageContext'

import { AuthProvider } from './context/AuthContext'
import { flushWhenOnline } from './lib/offlineStore'

createRoot(document.getElementById('root')).render(
  <StrictMode>
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
