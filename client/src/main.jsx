import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { SettingsProvider } from './context/SettingsContext.jsx'
import { MusicProvider } from './context/MusicContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SettingsProvider>
      <MusicProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </MusicProvider>
    </SettingsProvider>
  </StrictMode>,
)
