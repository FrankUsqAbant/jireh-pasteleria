-- es_admin() solo la usan las reglas RLS: se mueve a un esquema que la API REST no expone.
create schema if not exists privado;
revoke all on schema privado from public;
grant usage on schema privado to anon, authenticated;

create function privado.es_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.admins a join auth.users u on u.id = a.user_id
    where a.user_id = (select auth.uid())
      and (a.clave_temporal_hash is null or u.encrypted_password is distinct from a.clave_temporal_hash)
  );
$$;
revoke execute on function privado.es_admin() from public;
grant execute on function privado.es_admin() to anon, authenticated;

alter policy "tortas: lectura publica de activas" on public.tortas using (activo or (select privado.es_admin()));
alter policy "tortas: admin inserta" on public.tortas with check ((select privado.es_admin()));
alter policy "tortas: admin edita" on public.tortas using ((select privado.es_admin())) with check ((select privado.es_admin()));
alter policy "tortas: admin elimina" on public.tortas using ((select privado.es_admin()));
alter policy "fotos tortas: admin sube" on storage.objects with check (bucket_id = 'tortas' and (select privado.es_admin()));
alter policy "fotos tortas: admin reemplaza" on storage.objects using (bucket_id = 'tortas' and (select privado.es_admin()));
alter policy "fotos tortas: admin borra" on storage.objects using (bucket_id = 'tortas' and (select privado.es_admin()));

drop function public.es_admin();
