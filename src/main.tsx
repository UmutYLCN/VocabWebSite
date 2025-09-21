import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'
import { ThemeProvider } from './app/ThemeProvider'
import { StoreProvider } from './app/StoreProvider'
import { I18nProvider } from './app/I18nProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <StoreProvider>
        <I18nProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </I18nProvider>
      </StoreProvider>
    </ThemeProvider>
  </React.StrictMode>
)

