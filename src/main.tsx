
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'sonner'
import { LanguageProvider } from './lib/languageContext'

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <LanguageProvider>
        <Toaster position="top-right" richColors />
        <App />
      </LanguageProvider>
    </React.StrictMode>,
  )
} else {
  console.error("Root element not found");
}
