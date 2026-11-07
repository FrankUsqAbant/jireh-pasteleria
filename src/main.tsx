import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App, { isAdminHash } from './App';
import './index.css';
import './styles/sections.css';
import './styles/sections-lower.css';

const root = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// El build trae la tienda ya renderizada (scripts/prerender.mjs): se hidrata encima.
// El panel (#admin) y el servidor de desarrollo arrancan desde cero.
if (root.hasChildNodes() && !isAdminHash()) {
  hydrateRoot(root, app);
} else {
  root.textContent = '';
  createRoot(root).render(app);
}
