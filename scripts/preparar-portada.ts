/**
 * Prepara la tapa de la portada sin fresas: quita las fresas de la foto y rellena su lugar con la crema
 * de alrededor (promedio normalizado de la crema real, con sus luces y sombras). Lo que quedaba por encima
 * del borde de la torta pasa a ser transparente. Así la tapa puede caer sola y las fresas llegar después,
 * sin máscaras ni filtros mientras corre el sitio.
 *
 * Uso: npx tsx scripts/preparar-portada.ts
 * Entrada: fotos-fuente/portada-torta-recorte.png · Salida: public/assets/portada/torta-tapa.webp
 */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { FOTO_H as H, FOTO_W as W, FRESAS_PORTADA, MARGEN_FRESA, RECORTE_TAPA, SUPERFICIE as S } from '../src/data/portada';

const root = path.resolve(import.meta.dirname, '..');
const entrada = path.join(root, 'fotos-fuente', 'portada-torta-recorte.png');
const salida = path.join(root, 'public', 'assets', 'portada', 'torta-tapa.webp');
const N = W * H;

const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', entrada, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'], { maxBuffer: 64 << 20 });

/* 1. Máscara de las fresas: contornos rellenos + margen */
const fresa = new Uint8Array(N);
for (const f of FRESAS_PORTADA) {
  const p = f.puntos;
  const ys = p.map(([, y]) => y);
  for (let y = Math.max(0, Math.floor(Math.min(...ys))); y <= Math.min(H - 1, Math.ceil(Math.max(...ys))); y++) {
    const cortes: number[] = [];
    for (let i = 0; i < p.length; i++) {
      const [x1, y1] = p[i];
      const [x2, y2] = p[(i + 1) % p.length];
      if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) cortes.push(x1 + ((y - y1) / (y2 - y1)) * (x2 - x1));
    }
    cortes.sort((a, b) => a - b);
    for (let i = 0; i + 1 < cortes.length; i += 2)
      for (let x = Math.max(0, Math.ceil(cortes[i])); x <= Math.min(W - 1, Math.floor(cortes[i + 1])); x++) fresa[y * W + x] = 1;
  }
}
// Margen: distancia aproximada (chamfer 3-4) a la máscara
const d = new Float32Array(N).fill(1e9);
for (let k = 0; k < N; k++) if (fresa[k]) d[k] = 0;
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const k = y * W + x;
    if (x > 0) d[k] = Math.min(d[k], d[k - 1] + 3);
    if (y > 0) {
      d[k] = Math.min(d[k], d[k - W] + 3);
      if (x > 0) d[k] = Math.min(d[k], d[k - W - 1] + 4);
      if (x < W - 1) d[k] = Math.min(d[k], d[k - W + 1] + 4);
    }
  }
for (let y = H - 1; y >= 0; y--)
  for (let x = W - 1; x >= 0; x--) {
    const k = y * W + x;
    if (x < W - 1) d[k] = Math.min(d[k], d[k + 1] + 3);
    if (y < H - 1) {
      d[k] = Math.min(d[k], d[k + W] + 3);
      if (x < W - 1) d[k] = Math.min(d[k], d[k + W + 1] + 4);
      if (x > 0) d[k] = Math.min(d[k], d[k + W - 1] + 4);
    }
  }
const hueco = (k: number) => d[k] / 3 <= MARGEN_FRESA;

/* 2. ¿El píxel está sobre la superficie de la torta? (ahí se rellena con crema; afuera queda transparente) */
const sobreSuperficie = (x: number, y: number) => ((x - S.cx) / S.rx) ** 2 + ((y - S.cy) / S.ry) ** 2 <= 1;

/* 3. Relleno: promedio de la crema válida alrededor, con radios crecientes (tablas de sumas) */
const valido = new Uint8Array(N);
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const k = y * W + x;
    // Solo crema: clara y sin color (deja fuera flores, hojas y restos de fresa)
    const r = raw[k * 4], g = raw[k * 4 + 1], b = raw[k * 4 + 2];
    const crema = Math.min(r, g, b) > 175 && Math.max(r, g, b) - Math.min(r, g, b) < 26;
    valido[k] = !hueco(k) && raw[k * 4 + 3] > 230 && crema && sobreSuperficie(x, y) ? 1 : 0;
  }
function tabla(canal: (k: number) => number) {
  const t = new Float64Array((W + 1) * (H + 1));
  for (let y = 0; y < H; y++) {
    let fila = 0;
    for (let x = 0; x < W; x++) {
      fila += canal(y * W + x);
      t[(y + 1) * (W + 1) + x + 1] = t[y * (W + 1) + x + 1] + fila;
    }
  }
  return (x0: number, y0: number, x1: number, y1: number) => {
    x0 = Math.max(0, x0); y0 = Math.max(0, y0); x1 = Math.min(W, x1); y1 = Math.min(H, y1);
    return t[y1 * (W + 1) + x1] - t[y0 * (W + 1) + x1] - t[y1 * (W + 1) + x0] + t[y0 * (W + 1) + x0];
  };
}
const peso = tabla((k) => valido[k]);
const sumas = [0, 1, 2].map((c) => tabla((k) => (valido[k] ? raw[k * 4 + c] : 0)));

const out = Buffer.from(raw);
let semilla = 7;
const ruido = () => ((semilla = (semilla * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff - 0.5) * 4; // grano leve
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const k = y * W + x;
    if (!hueco(k)) continue;
    if (!sobreSuperficie(x, y)) {
      out[k * 4 + 3] = 0; // por encima del borde: nada (las fresas que sobresalían)
      continue;
    }
    for (const r of [16, 32, 64, 128, 256]) {
      const w = peso(x - r, y - r, x + r + 1, y + r + 1);
      if (w < 40) continue;
      for (let c = 0; c < 3; c++) out[k * 4 + c] = sumas[c](x - r, y - r, x + r + 1, y + r + 1) / w;
      out[k * 4 + 3] = 255;
      break;
    }
  }

/* 4. Suavizar el relleno (tres pasadas de caja ~ gaussiana) para que no queden bordes cuadrados, y grano leve */
const relleno = new Uint8Array(N);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) relleno[y * W + x] = hueco(y * W + x) && sobreSuperficie(x, y) ? 1 : 0;
for (let pasada = 0; pasada < 3; pasada++)
  for (const eje of [1, W]) {
    const copia = Buffer.from(out);
    const R = 9;
    for (let k = 0; k < N; k++) {
      if (!relleno[k]) continue;
      const acc = [0, 0, 0];
      let n = 0;
      for (let i = -R; i <= R; i++) {
        const j = k + i * eje;
        if (j < 0 || j >= N || copia[j * 4 + 3] < 200) continue;
        acc[0] += copia[j * 4]; acc[1] += copia[j * 4 + 1]; acc[2] += copia[j * 4 + 2];
        n++;
      }
      if (n) for (let c = 0; c < 3; c++) out[k * 4 + c] = acc[c] / n;
    }
  }
for (let k = 0; k < N; k++)
  if (relleno[k]) {
    const g = ruido();
    for (let c = 0; c < 3; c++) out[k * 4 + c] = Math.max(0, Math.min(255, out[k * 4 + c] + g));
  }

// Solo se guarda la zona de la tapa (RECORTE_TAPA): lo demás de la foto no lo usa esta pieza
const R = RECORTE_TAPA;
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-i', '-', '-vf', `gblur=sigma=0.6,crop=${R.w}:${R.h}:${R.x}:${R.y},scale=${Math.round(R.w * 0.75)}:-2`, '-c:v', 'libwebp', '-quality', '80', '-pix_fmt', 'yuva420p', salida], { input: out });
console.log('listo:', path.relative(root, salida));
