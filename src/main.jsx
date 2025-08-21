import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Make sure App.jsx is imported

// This is the standard and correct way to render a React 18 app.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
 </React.StrictMode>,
)