import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';           // estilos globales primero

// Si más adelante usas react-router, aquí iría el <BrowserRouter>
// Por ahora mantenemos la versión simple sin router

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);