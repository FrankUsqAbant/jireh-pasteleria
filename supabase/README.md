# Base de datos (Supabase)

Proyecto: `jireh-pasteleria` · región São Paulo (sa-east-1) · plan gratuito.

| Archivo | Qué hace |
|---|---|
| `migrations/0001_catalogo_tortas_y_admin.sql` | Tabla `tortas`, tabla `admins`, reglas RLS y bucket de fotos `tortas` |
| `migrations/0002_es_admin_en_esquema_privado.sql` | Mueve `es_admin()` a un esquema que la API no expone |
| `migrations/0003_fotos_tortas_admin_lee.sql` | Permiso de lectura de fotos para el admin (Storage lo exige para borrar) |
| `seed.sql` | Catálogo inicial (se genera con `npx tsx scripts/generar-seed.ts`) |

**Permisos:** cualquiera lee las tortas activas; solo un administrador (fila en `admins` que ya cambió su
clave temporal) puede crear, editar, borrar y subir fotos. La clave pública (`VITE_SUPABASE_KEY`) no da
más permisos que esos: todo lo decide la base de datos.
