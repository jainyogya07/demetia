import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { I18nProvider } from './I18nContext.jsx'
import { PrefsProvider } from './PrefsContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

import { AuthProvider } from './context/AuthContext.jsx'
import { flushWhenOnline } from './lib/offlineStore.js'

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
