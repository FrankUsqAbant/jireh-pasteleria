/**
 * Genera supabase/seed.sql a partir del catálogo incluido en el sitio (src/data/bakeryData.ts).
 * Uso: npx tsx scripts/generar-seed.ts
 */
import { writeFileSync } from 'node:fs';
import { FEATURED_SPECIALTIES, GALLERY_CAKES } from '../src/data/bakeryData';

const unicos = new Map([...FEATURED_SPECIALTIES, ...GALLERY_CAKES].map((t) => [t.id, t]));
const txt = (s?: string | null) => (s == null || s === '' ? 'null' : `'${s.replace(/'/g, "''")}'`);
const arr = (a?: string[]) => `array[${(a ?? []).map((s) => txt(s)).join(', ')}]::text[]`;

const filas = [...unicos.values()].map((t, i) =>
  `  (${txt(t.name)}, ${txt(t.category)}, ${txt(t.description) === 'null' ? "''" : txt(t.description)}, ${txt(t.portions) === 'null' ? "''" : txt(t.portions)}, ${t.basePrice}, ${txt(t.image)}, ${txt(t.badge)}, ${Boolean(t.isPopular)}, ${t.isCustomizable !== false}, ${arr(t.flavors)}, ${arr(t.fillings)}, ${i})`,
);

writeFileSync(
  'supabase/seed.sql',
  `-- Catálogo inicial (generado por scripts/generar-seed.ts). Solo se carga si la tabla está vacía.\n` +
    `insert into public.tortas (nombre, categoria, descripcion, porciones, precio, imagen_url, etiqueta, destacada, personalizable, sabores, rellenos, orden)\n` +
    `select * from (values\n${filas.join(',\n')}\n) v\nwhere not exists (select 1 from public.tortas);\n`,
);
console.log(`seed.sql: ${filas.length} tortas`);
