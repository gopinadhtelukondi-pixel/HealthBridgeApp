/*
 * src/main.jsx
 * ─────────────────────────────────────────────────────────────
 * React application entry point.
 * Mounts the <App /> component into #root in index.html.
 * Wraps the app with React.StrictMode for development warnings.
 * ─────────────────────────────────────────────────────────────
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css'
import './index.css'   // Tailwind + global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
