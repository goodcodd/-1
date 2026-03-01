import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// Визначаємо base path для GitHub Pages
const getBasePath = () => {
  // Якщо працюємо на GitHub Pages з репозиторієм "-1"
  if (window.location.hostname === 'goodcodd.github.io' || 
      window.location.pathname.startsWith('/-1/')) {
    return '/-1';
  }
  return '';
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={getBasePath()}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
