import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { enableMocking } from './mocks/browser';

const renderApp = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

enableMocking()
  .then(renderApp)
  .catch((err) => {
    console.warn('MSW worker failed to start, rendering app anyway:', err);
    renderApp();
  });
