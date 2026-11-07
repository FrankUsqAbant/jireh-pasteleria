import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

/** Renderiza la tienda a HTML en el build (scripts/prerender.mjs) para que se vea antes de cargar el JS. */
export function render(): string {
  return renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
