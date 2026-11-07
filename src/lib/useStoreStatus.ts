import { useEffect, useState } from 'react';
import { isStoreOpen } from '../utils/orderCalculator';

/**
 * Si la tienda está abierta ahora (hora de Perú). Devuelve null en el HTML pre-renderizado y en el
 * primer render del navegador, para que coincidan; luego se calcula y se actualiza cada minuto.
 */
export function useStoreOpen(): boolean | null {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const update = () => setOpen(isStoreOpen().isOpen);
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);
  return open;
}
