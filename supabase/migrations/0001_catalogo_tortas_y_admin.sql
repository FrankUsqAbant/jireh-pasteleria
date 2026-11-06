-- Administradores: usuarios de Supabase Auth con permiso para editar el catálogo.
-- clave_temporal_hash: mientras la contraseña siga siendo la temporal, no puede editar (debe cambiarla primero).
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  clave_temporal_hash text,
  creado timestamptz not null default now()
);
alter table public.admins enable row level security; -- sin políticas: solo se lee a través de las funciones

create function public.es_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.admins a join auth.users u on u.id = a.user_id
    where a.user_id = (select auth.uid())
      and (a.clave_temporal_hash is null or u.encrypted_password is distinct from a.clave_temporal_hash)
  );
$$;

-- 'no' · 'cambiar_clave' · 'admin'
create function public.estado_admin() returns text
language sql stable security definer set search_path = '' as $$
  select case
    when a.user_id is null then 'no'
    when a.clave_temporal_hash is not null and u.encrypted_password is not distinct from a.clave_temporal_hash then 'cambiar_clave'
    else 'admin'
  end
  from (select 1) x
  left join public.admins a on a.user_id = (select auth.uid())
  left join auth.users u on u.id = a.user_id;
$$;

revoke execute on function public.estado_admin() from public, anon;
grant execute on function public.estado_admin() to authenticated;

create function public.tocar_actualizado() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.actualizado = now();
  return new;
end;
$$;

-- Catálogo de tortas
create table public.tortas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(btrim(nombre)) between 2 and 80),
  categoria text not null check (categoria in ('cumpleanos', 'infantiles', 'bodas', 'tematicas', 'panaderia')),
  descripcion text not null default '' check (char_length(descripcion) <= 600),
  porciones text not null default '' check (char_length(porciones) <= 60),
  precio numeric(8, 2) not null check (precio > 0 and precio < 100000),
  imagen_url text not null check (char_length(imagen_url) between 1 and 500),
  imagen_path text check (char_length(imagen_path) <= 300),
  etiqueta text check (char_length(etiqueta) <= 30),
  destacada boolean not null default false,
  personalizable boolean not null default true,
  sabores text[] not null default '{}' check (cardinality(sabores) <= 20),
  rellenos text[] not null default '{}' check (cardinality(rellenos) <= 20),
  activo boolean not null default true,
  orden integer not null default 0,
  creado timestamptz not null default now(),
  actualizado timestamptz not null default now()
);
create index tortas_listado_idx on public.tortas (activo, orden, creado);

create trigger tortas_actualizado before update on public.tortas
  for each row execute function public.tocar_actualizado();

alter table public.tortas enable row level security;

create policy "tortas: lectura publica de activas" on public.tortas
  for select to anon, authenticated
  using (activo or (select public.es_admin()));

create policy "tortas: admin inserta" on public.tortas
  for insert to authenticated with check ((select public.es_admin()));

create policy "tortas: admin edita" on public.tortas
  for update to authenticated using ((select public.es_admin())) with check ((select public.es_admin()));

create policy "tortas: admin elimina" on public.tortas
  for delete to authenticated using ((select public.es_admin()));

-- Fotos de las tortas: lectura pública por URL, escritura solo admin. Máx. 5 MB, solo imágenes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tortas', 'tortas', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

create policy "fotos tortas: admin sube" on storage.objects
  for insert to authenticated with check (bucket_id = 'tortas' and (select public.es_admin()));

create policy "fotos tortas: admin reemplaza" on storage.objects
  for update to authenticated using (bucket_id = 'tortas' and (select public.es_admin()));

create policy "fotos tortas: admin borra" on storage.objects
  for delete to authenticated using (bucket_id = 'tortas' and (select public.es_admin()));
