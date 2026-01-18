import React from 'react';
import ReactDOM from 'react-dom/client';
import { VisibilityProvider } from './providers/VisibilityProvider';
import Register from './components/Register';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <VisibilityProvider>
      <Register />
    </VisibilityProvider>
  </React.StrictMode>,
);
