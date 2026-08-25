import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { I18nProvider } from './I18nContext.jsx'
import { PrefsProvider } from './PrefsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <PrefsProvider>
          <App />
        </PrefsProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
)
