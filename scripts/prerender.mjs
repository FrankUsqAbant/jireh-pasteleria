/**
 * Pre-renderiza la tienda dentro de dist/index.html después del build.
 * Así el título y el contenido se ven apenas llega el HTML, sin esperar a que cargue el JavaScript.
 * Uso: lo corre `npm run build`.
 */
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const htmlPath = path.join(root, 'dist', 'index.html');
const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);

const html = readFileSync(htmlPath, 'utf8');
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error('No encontré <div id="root"></div> en dist/index.html');

writeFileSync(htmlPath, html.replace(marker, `<div id="root">${render()}</div>`));
rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log('pre-render: dist/index.html listo');
