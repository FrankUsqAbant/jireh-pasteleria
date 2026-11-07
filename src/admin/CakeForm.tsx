import React, { useState } from 'react';
import { ArrowLeft, Trash2, Upload } from 'lucide-react';
import type { CakeCategory, CakeItem } from '../types/bakery';
import { CAKE_CATEGORIES } from '../data/bakeryData';
import { PRESET_PRODUCT_IMAGES } from './presetImages';
import { deletePhoto, friendlyError, uploadPhoto } from './adminApi';

type CakeData = Omit<CakeItem, 'id'>;

interface CakeFormProps {
  /** La torta a editar; sin ella, es una torta nueva. */
  cake?: CakeItem;
  busy: boolean;
  onSave: (data: CakeData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  onError: (msg: string) => void;
}

const lista = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

/** Formulario de una torta: lo esencial primero, lo avanzado plegado y el botón Guardar siempre a mano. */
export const CakeForm: React.FC<CakeFormProps> = ({ cake, busy, onSave, onCancel, onDelete, onError }) => {
  const [name, setName] = useState(cake?.name ?? '');
  const [price, setPrice] = useState(cake ? String(cake.basePrice) : '');
  const [portions, setPortions] = useState(cake?.portions ?? '20-25 porciones');
  const [category, setCategory] = useState<CakeCategory>(cake?.category ?? 'cumpleanos');
  const [description, setDescription] = useState(cake?.description ?? '');
  const [image, setImage] = useState(cake?.image ?? PRESET_PRODUCT_IMAGES[0].url);
  const [imagePath, setImagePath] = useState<string | undefined>(cake?.imagePath);
  const [badge, setBadge] = useState(cake?.badge ?? '');
  const [visible, setVisible] = useState(cake?.isActive !== false);
  const [featured, setFeatured] = useState(Boolean(cake?.isPopular));
  const [customizable, setCustomizable] = useState(cake?.isCustomizable !== false);
  const [flavors, setFlavors] = useState(cake?.flavors?.join(', ') ?? '');
  const [fillings, setFillings] = useState(cake?.fillings?.join(', ') ?? '');
  const [uploading, setUploading] = useState(false);

  const priceNumber = Number(price.replace(',', '.'));
  const valid = name.trim().length >= 2 && priceNumber > 0;

  /** Borra una foto subida en este formulario que no llegó a guardarse. */
  const discardUnsaved = () => {
    if (imagePath && imagePath !== cake?.imagePath) void deletePhoto(imagePath);
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      discardUnsaved();
      const { url, path } = await uploadPhoto(file);
      setImage(url);
      setImagePath(path);
    } catch (err) {
      onError(friendlyError(err));
    } finally {
      setUploading(false);
    }
  };

  const choosePreset = (url: string) => {
    discardUnsaved();
    setImage(url);
    setImagePath(undefined);
  };

  const cancel = () => {
    discardUnsaved();
    onCancel();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || busy || uploading) return;
    const f = lista(flavors);
    const r = lista(fillings);
    onSave({
      name: name.trim(),
      basePrice: priceNumber,
      portions: portions.trim() || '20-25 porciones',
      category,
      description: description.trim(),
      image,
      imagePath,
      badge: badge.trim() || undefined,
      isActive: visible,
      isPopular: featured,
      isCustomizable: customizable,
      flavors: f.length ? f : undefined,
      fillings: r.length ? r : undefined,
    });
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="adm-encabezado">
        <div>
          <button type="button" className="adm-btn adm-btn--borde" onClick={cancel}>
            <ArrowLeft aria-hidden="true" /> Volver a la lista
          </button>
          <h1 style={{ marginTop: 16 }}>{cake ? 'Editar torta' : 'Nueva torta'}</h1>
        </div>
        {cake && onDelete && (
          <button type="button" className="adm-btn adm-btn--borde" onClick={onDelete}>
            <Trash2 aria-hidden="true" /> Eliminar
          </button>
        )}
      </div>

      <div className="adm-form">
        <div className="adm-form__campos">
          <section className="adm-tarjeta" aria-labelledby="f-foto">
            <h2 id="f-foto">Foto</h2>
            <div className="adm-foto">
              <img src={image} alt="" />
              <label className="adm-subir">
                <Upload aria-hidden="true" />
                {uploading ? 'Subiendo…' : imagePath && imagePath !== cake?.imagePath ? 'Foto subida · cambiar' : 'Subir una foto'}
                <small>Desde tu celular o computadora. JPG, PNG o WebP, hasta 5 MB.</small>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} disabled={uploading} className="sr-only" />
              </label>
            </div>
            <div>
              <p className="adm-etiqueta" id="f-galeria">O elige una de las fotos del sitio</p>
              <div className="adm-galeria" role="group" aria-labelledby="f-galeria">
                {PRESET_PRODUCT_IMAGES.map((p) => (
                  <button key={p.url} type="button" aria-pressed={image === p.url} aria-label={p.label} onClick={() => choosePreset(p.url)}>
                    <img src={p.url} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="adm-tarjeta" aria-labelledby="f-datos">
            <h2 id="f-datos">Datos</h2>
            <div className="adm-campo">
              <label htmlFor="f-nombre">Nombre</label>
              <input id="f-nombre" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Torta Selva Negra" required />
            </div>
            <div className="adm-dos">
              <div className="adm-campo">
                <label htmlFor="f-precio">Precio desde</label>
                <div className="adm-prefijo">
                  <span aria-hidden="true">S/</span>
                  <input id="f-precio" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="85" required />
                </div>
              </div>
              <div className="adm-campo">
                <label htmlFor="f-porciones">Porciones</label>
                <input id="f-porciones" value={portions} onChange={(e) => setPortions(e.target.value)} maxLength={60} placeholder="20-25 porciones" />
              </div>
            </div>
            <fieldset className="adm-campo" style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="adm-etiqueta" style={{ marginBottom: 6 }}>Categoría</legend>
              <div className="adm-categorias">
                {CAKE_CATEGORIES.map((c) => (
                  <label key={c.id} className="adm-opcion">
                    <input type="radio" name="categoria" value={c.id} checked={category === c.id} onChange={() => setCategory(c.id)} />
                    {c.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="adm-campo">
              <label htmlFor="f-descripcion">Descripción</label>
              <textarea id="f-descripcion" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={600} placeholder="Bizcocho de chocolate, chantilly y cerezas." />
            </div>
          </section>

          <section className="adm-tarjeta" aria-labelledby="f-tienda">
            <h2 id="f-tienda">En la tienda</h2>
            <div className="adm-interruptores">
              <Interruptor checked={visible} onChange={setVisible} titulo="Visible" detalle="Si la apagas, la torta deja de verse en la tienda (no se borra)." />
              <Interruptor checked={featured} onChange={setFeatured} titulo="Destacada" detalle="Aparece entre las primeras del catálogo." />
              <Interruptor checked={customizable} onChange={setCustomizable} titulo="Se puede personalizar" detalle="El cliente puede pedir otros sabores o rellenos." />
            </div>
            <details className="adm-avanzado">
              <summary>Más opciones</summary>
              <div style={{ display: 'grid', gap: 14 }}>
                <div className="adm-campo">
                  <label htmlFor="f-etiqueta">Etiqueta sobre la foto</label>
                  <input id="f-etiqueta" value={badge} onChange={(e) => setBadge(e.target.value)} maxLength={30} placeholder="La más pedida" />
                  <p className="adm-ayuda">Opcional. Pocas palabras, por ejemplo "Nueva" o "La más pedida".</p>
                </div>
                <div className="adm-campo">
                  <label htmlFor="f-sabores">Sabores de bizcocho</label>
                  <input id="f-sabores" value={flavors} onChange={(e) => setFlavors(e.target.value)} placeholder="Vainilla, Chocolate" />
                  <p className="adm-ayuda">Separados por coma.</p>
                </div>
                <div className="adm-campo">
                  <label htmlFor="f-rellenos">Rellenos</label>
                  <input id="f-rellenos" value={fillings} onChange={(e) => setFillings(e.target.value)} placeholder="Manjar blanco, Fudge" />
                  <p className="adm-ayuda">Separados por coma.</p>
                </div>
              </div>
            </details>
          </section>
        </div>

        <aside className="adm-previa" aria-label="Así se verá en la tienda">
          <p className="adm-previa__titulo">Así se verá en la tienda</p>
          <div className="adm-previa__tarjeta">
            <img src={image} alt="" />
            <p className="adm-previa__nombre">{name.trim() || 'Nombre de la torta'}</p>
            <p className="adm-previa__precio">desde S/ {priceNumber > 0 ? priceNumber : '—'}</p>
          </div>
          {!visible && <p className="adm-ayuda">Oculta: no se mostrará hasta que la vuelvas a hacer visible.</p>}
        </aside>
      </div>

      <div className="adm-guardar">
        <div className="adm-guardar__bar">
          <p className="adm-ayuda">{valid ? 'Los cambios se ven en la tienda apenas guardas.' : 'Falta el nombre y el precio.'}</p>
          <button type="button" className="adm-btn adm-btn--borde" onClick={cancel}>
            Cancelar
          </button>
          <button type="submit" className="adm-btn adm-btn--principal" disabled={!valid || busy || uploading}>
            {busy ? 'Guardando…' : cake ? 'Guardar cambios' : 'Publicar torta'}
          </button>
        </div>
      </div>
    </form>
  );
};

/** Interruptor accesible (role switch) con título y explicación. */
export const Interruptor: React.FC<{ checked: boolean; onChange: (v: boolean) => void; titulo: string; detalle?: string; compacto?: boolean; etiqueta?: string }> = ({
  checked,
  onChange,
  titulo,
  detalle,
  compacto,
  etiqueta,
}) => (
  <button type="button" role="switch" aria-checked={checked} aria-label={etiqueta} className="adm-switch" onClick={() => onChange(!checked)}>
    {compacto ? (
      <span>{titulo}</span>
    ) : (
      <span>
        {titulo}
        {detalle && <small>{detalle}</small>}
      </span>
    )}
    <span className="adm-switch__pista" aria-hidden="true" />
  </button>
);
