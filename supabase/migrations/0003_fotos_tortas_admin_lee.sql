-- Storage necesita permiso SELECT para borrar o reemplazar un archivo. Solo el admin puede listar;
-- el público sigue viendo cada foto por su URL directa (bucket público) pero no puede listarlas.
create policy "fotos tortas: admin lee" on storage.objects
  for select to authenticated using (bucket_id = 'tortas' and (select privado.es_admin()));
