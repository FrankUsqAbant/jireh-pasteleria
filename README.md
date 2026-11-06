# JIRÉH Panadería y Pastelería — sitio web (demo)

Catálogo de tortas, personalización y pedidos por WhatsApp para JIRÉH (Cajamarca).
React 19 + Vite + Tailwind 4. El catálogo y el panel de administración usan **Supabase** (plan gratuito).

## Correr en local

```bash
npm install
cp .env.example .env.local   # completar VITE_SUPABASE_URL y VITE_SUPABASE_KEY
npm run dev                  # http://localhost:5173
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor local en el puerto 5173 |
| `npm run build` | Build de producción en `dist/` |
| `npm run lint` | Revisión de tipos (TypeScript) |
| `npm test` | Tests (`src/**/*.test.ts`) |

## Estructura

```
src/
  App.tsx                 tienda (secciones y modales)
  components/             secciones de la tienda
  data/bakeryData.ts      textos y catálogo de respaldo
  lib/supabase.ts         configuración de Supabase
  lib/catalog.ts          catálogo público (lee Supabase; si falla, usa el de respaldo)
  admin/                  panel /#admin (se descarga solo al entrar)
    AdminApp.tsx          inicio de sesión, cambio de clave temporal, cierre por inactividad
    AdminProductsPage.tsx catálogo, formulario de torta, ajustes
    adminApi.ts           operaciones contra Supabase
supabase/                 migraciones SQL y catálogo inicial (ver supabase/README.md)
```

## Panel de administración

Entrar a `/#admin`. La cuenta de la demo y su clave temporal están en `.admin-temporal.txt`
(no se sube a git). En el primer ingreso el panel obliga a crear una contraseña propia; mientras tanto
la base de datos no permite editar nada.
