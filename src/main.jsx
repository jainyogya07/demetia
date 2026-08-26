import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { I18nProvider } from './I18nContext.jsx'
import { PrefsProvider } from './PrefsContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

import { AuthProvider } from './context/AuthContext.jsx'

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
