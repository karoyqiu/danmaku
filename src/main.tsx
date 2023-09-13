import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

if (import.meta.env.PROD) {
  document.addEventListener('contextmenu', (event) => {
    if (!event.target || !('tagName' in event.target) || event.target.tagName !== 'INPUT') {
      event.preventDefault();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
