import React, { useMemo } from 'react';

/**
 * Costura entre dos secciones: como en un corte real, entre capa y capa hay una franja de relleno
 * con el borde levemente irregular. Es decorativa (aria-hidden).
 */
export const Seam: React.FC<{ top: string; band: string; bottom: string; seed?: number }> = ({ top, band, bottom, seed = 1 }) => {
  const { bandPath, bottomPath } = useMemo(() => {
    let s = seed * 9301 + 49297;
    const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const edge = (y: number, amp: number) => {
      const pts: string[] = [];
      for (let x = 0; x <= 1200; x += 40) pts.push(`${x},${(y + (r() - 0.5) * 2 * amp).toFixed(1)}`);
      return pts;
    };
    const a = edge(9, 2.4);
    const b = edge(19, 2.4);
    return {
      bandPath: `M0,30 L${a.join(' L')} L1200,30 Z`,
      bottomPath: `M0,30 L${b.join(' L')} L1200,30 Z`,
    };
  }, [seed]);

  return (
    <svg className="seam" viewBox="0 0 1200 30" preserveAspectRatio="none" aria-hidden="true" style={{ background: top }}>
      <path d={bandPath} fill={band} />
      <path d={bottomPath} fill={bottom} />
    </svg>
  );
};
