-- Libro de Reclamaciones virtual (Código de Protección y Defensa del Consumidor, Perú).
-- El público solo puede registrar hojas mediante registrar_reclamo(); nadie las lee salvo el administrador.
create table public.reclamaciones_contador (
  tipo text not null check (tipo in ('RECLAMO', 'QUEJA')),
  anio integer not null,
  ultimo integer not null default 0,
  primary key (tipo, anio)
);
alter table public.reclamaciones_contador enable row level security;

create table public.reclamaciones (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  tipo text not null check (tipo in ('RECLAMO', 'QUEJA')),
  anio integer not null,
  correlativo integer not null,
  creado_en timestamptz not null default now(),
  nombre text not null check (char_length(nombre) between 3 and 120),
  tipo_doc text not null check (tipo_doc in ('DNI', 'CE', 'PASAPORTE')),
  nro_doc text not null check (char_length(nro_doc) between 5 and 20),
  telefono text not null check (char_length(telefono) between 6 and 20),
  correo text not null check (char_length(correo) <= 160 and correo ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  domicilio text check (char_length(domicilio) <= 200),
  tipo_bien text not null check (tipo_bien in ('PRODUCTO', 'SERVICIO')),
  descripcion_bien text check (char_length(descripcion_bien) <= 300),
  monto text check (char_length(monto) <= 40),
  detalle text not null check (char_length(detalle) between 10 and 3000),
  pedido text not null check (char_length(pedido) between 5 and 1500),
  estado text not null default 'PENDIENTE' check (estado in ('PENDIENTE', 'EN_PROCESO', 'RESUELTO')),
  respuesta text,
  respondido_en timestamptz,
  ip_hash text,
  unique (tipo, anio, correlativo)
);
create index reclamaciones_ip_idx on public.reclamaciones (ip_hash, creado_en);
alter table public.reclamaciones enable row level security;

create policy "reclamaciones: admin lee" on public.reclamaciones
  for select to authenticated using ((select privado.es_admin()));
create policy "reclamaciones: admin responde" on public.reclamaciones
  for update to authenticated using ((select privado.es_admin())) with check ((select privado.es_admin()));

create function public.registrar_reclamo(p jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_tipo text := upper(btrim(coalesce(p->>'tipo', '')));
  v_anio int := extract(year from (now() at time zone 'America/Lima'))::int;
  v_ip text;
  v_ip_hash text;
  v_num int;
  v_codigo text;
  v_creado timestamptz;
begin
  -- Campo trampa para bots: una persona nunca lo llena.
  if coalesce(p->>'website', '') <> '' then
    raise exception 'datos_invalidos';
  end if;
  if v_tipo not in ('RECLAMO', 'QUEJA') then
    raise exception 'datos_invalidos';
  end if;

  -- Límite: 5 hojas por hora por conexión (solo se guarda un hash de la IP).
  v_ip := btrim(split_part(coalesce((current_setting('request.headers', true)::jsonb)->>'x-forwarded-for', ''), ',', 1));
  if v_ip <> '' then
    v_ip_hash := encode(sha256(convert_to(v_ip || '|jireh', 'UTF8')), 'hex');
    if (select count(*) from public.reclamaciones
         where ip_hash = v_ip_hash and creado_en > now() - interval '1 hour') >= 5 then
      raise exception 'limite_excedido';
    end if;
  end if;

  begin
    insert into public.reclamaciones_contador as c (tipo, anio, ultimo)
    values (v_tipo, v_anio, 1)
    on conflict (tipo, anio) do update set ultimo = c.ultimo + 1
    returning c.ultimo into v_num;

    v_codigo := case when v_tipo = 'RECLAMO' then 'REC' else 'QUE' end
                || '-' || v_anio || '-' || lpad(v_num::text, 4, '0');

    insert into public.reclamaciones (
      codigo, tipo, anio, correlativo, nombre, tipo_doc, nro_doc, telefono, correo,
      domicilio, tipo_bien, descripcion_bien, monto, detalle, pedido, ip_hash
    ) values (
      v_codigo, v_tipo, v_anio, v_num,
      btrim(coalesce(p->>'nombre', '')),
      upper(btrim(coalesce(p->>'tipo_doc', ''))),
      btrim(coalesce(p->>'nro_doc', '')),
      btrim(coalesce(p->>'telefono', '')),
      btrim(coalesce(p->>'correo', '')),
      nullif(btrim(coalesce(p->>'domicilio', '')), ''),
      upper(btrim(coalesce(p->>'tipo_bien', ''))),
      nullif(btrim(coalesce(p->>'descripcion_bien', '')), ''),
      nullif(btrim(coalesce(p->>'monto', '')), ''),
      btrim(coalesce(p->>'detalle', '')),
      btrim(coalesce(p->>'pedido', '')),
      v_ip_hash
    )
    returning creado_en into v_creado;
  exception when check_violation or not_null_violation then
    raise exception 'datos_invalidos'; -- también deshace el avance del contador
  end;

  return jsonb_build_object('codigo', v_codigo, 'creado_en', v_creado);
end;
$$;
revoke execute on function public.registrar_reclamo(jsonb) from public;
grant execute on function public.registrar_reclamo(jsonb) to anon, authenticated;
