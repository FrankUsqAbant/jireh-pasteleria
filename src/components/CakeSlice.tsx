import React, { useId, useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import type { CakeChoice, FillingOption, FrostingOption, SpongeOption } from '../data/layers';
import { prefersReducedMotion, SETTLE } from '../lib/motion';

/**
 * La tajada: el corte frontal de una torta, capa por capa. Es el centro del concepto del sitio:
 * aparece en la portada y en "Arma tu torta", donde cambia en vivo con cada elección.
 * Verbo de movimiento: las capas bajan unos pixeles y se asientan como crema.
 */

interface CakeSliceProps {
  choice: CakeChoice;
  /** Armar la tajada capa por capa la primera vez que entra en pantalla. */
  intro?: boolean;
  className?: string;
}

/* ---------------------------------- geometría ---------------------------------- */

const X0 = 48;
const X1 = 352;
const BASE = 380;
const SPONGE = 68;
const FILL = 18;
const TOP = 22;

// Capas de abajo hacia arriba: [id, alto]
const STACK = [
  ['s1', SPONGE],
  ['f1', FILL],
  ['s2', SPONGE],
  ['f2', FILL],
  ['s3', SPONGE],
] as const;

const layerTop: Record<string, number> = {};
{
  let y = BASE;
  for (const [id, h] of STACK) {
    y -= h;
    layerTop[id] = y;
  }
}
const TOP_Y = layerTop.s3 - TOP; // borde superior de la cobertura

/** Aleatorio determinista: la tajada se dibuja igual en cada carga. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rectángulo cuyo borde superior es levemente irregular, como un corte con cuchillo. */
function layerPath(top: number, bottom: number, seed: number, amp = 1.6) {
  const r = rng(seed);
  const pts: string[] = [];
  for (let x = X0; x <= X1; x += 19) {
    pts.push(`${x.toFixed(1)},${(top + (r() - 0.5) * 2 * amp).toFixed(1)}`);
  }
  pts.push(`${X1},${top.toFixed(1)}`);
  return `M${X0},${bottom} L${pts.join(' L')} L${X1},${bottom} Z`;
}

/** Puntos repartidos dentro de una capa (chispas, frutas, semillas). */
function scatter(top: number, h: number, n: number, seed: number) {
  const r = rng(seed);
  return Array.from({ length: n }, () => ({
    x: X0 + 14 + r() * (X1 - X0 - 28),
    y: top + 6 + r() * (h - 12),
    s: 0.6 + r() * 0.8,
    a: r() * 180,
  }));
}

const DRIPS = [
  { x: 74, len: 26, w: 13 },
  { x: 118, len: 44, w: 15 },
  { x: 161, len: 20, w: 12 },
  { x: 205, len: 36, w: 14 },
  { x: 252, len: 50, w: 15 },
  { x: 296, len: 24, w: 12 },
  { x: 330, len: 34, w: 13 },
];

/* ------------------------------------ partes ------------------------------------ */

const Sponge: React.FC<{ id: 's1' | 's2' | 's3'; opt: SpongeOption; seed: number; texture: string }> = ({ id, opt, seed, texture }) => {
  const top = layerTop[id];
  const bottom = top + SPONGE + 2;
  const d = layerPath(top, bottom, seed);
  return (
    <g data-layer={id}>
      <path d={d} fill={opt.color} />
      <path d={d} fill={opt.crumbColor} filter={`url(#${texture})`} opacity={0.55} />
      {opt.crumb === 'chips' &&
        scatter(top, SPONGE, 14, seed + 7).map((p, i) => (
          <ellipse key={i} cx={p.x} cy={p.y} rx={2.6 * p.s} ry={1.6 * p.s} transform={`rotate(${p.a} ${p.x} ${p.y})`} fill={opt.crumbColor} />
        ))}
      {opt.crumb === 'fruit' &&
        scatter(top, SPONGE, 12, seed + 3).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.4 * p.s} fill={i % 3 === 0 ? '#5f7d2e' : opt.crumbColor} />
        ))}
      {opt.crumb === 'swirl' && (
        <path
          d={`M${X0 + 8},${top + 40} C${X0 + 70},${top + 8} ${X0 + 120},${top + 60} ${X0 + 175},${top + 30} S${X1 - 60},${top + 14} ${X1 - 8},${top + 38}`}
          fill="none"
          stroke={opt.crumbColor}
          strokeWidth={9}
          strokeLinecap="round"
          opacity={0.85}
        />
      )}
    </g>
  );
};

const Filling: React.FC<{ id: 'f1' | 'f2'; opt: FillingOption; seed: number }> = ({ id, opt, seed }) => {
  const top = layerTop[id];
  return (
    <g data-layer={id}>
      <path d={layerPath(top, top + FILL + 2, seed, 1.2)} fill={opt.color} />
      {opt.bits !== 'none' &&
        scatter(top - 2, FILL + 4, opt.bits === 'seeds' ? 22 : 9, seed + 11).map((p, i) =>
          opt.bits === 'seeds' ? (
            <circle key={i} cx={p.x} cy={p.y} r={1.2 * p.s} fill="#2a1710" />
          ) : (
            <rect key={i} x={p.x - 5} y={p.y - 3.5} width={10 * p.s} height={7} rx={3.5} fill={opt.bits === 'berries' ? '#c22a35' : '#f0943a'} />
          ),
        )}
    </g>
  );
};

const Toppings: React.FC<{ frosting: FrostingOption }> = ({ frosting }) => {
  const y = TOP_Y;
  switch (frosting.topping) {
    case 'berries':
      return (
        <g>
          {[
            { x: 96, s: 1 },
            { x: 168, s: 1.15 },
            { x: 246, s: 0.95 },
            { x: 312, s: 1.05 },
          ].map((b, i) => (
            <g key={i} transform={`translate(${b.x} ${y - 4}) scale(${b.s})`}>
              <path d="M0,-30 C-15,-30 -19,-16 -14,-6 C-10,2 -4,6 0,8 C4,6 10,2 14,-6 C19,-16 15,-30 0,-30 Z" fill="#c22a35" />
              <path d="M-9,-30 L0,-36 L9,-30 L3,-28 L0,-33 L-3,-28 Z" fill="#4f7a2b" />
              {[-7, 0, 7, -4, 4].map((dx, j) => (
                <circle key={j} cx={dx} cy={-20 + (j > 2 ? 10 : 0)} r={1.1} fill="#f6d27a" />
              ))}
            </g>
          ))}
          {[132, 210, 280].map((x, i) => (
            <g key={i}>
              <path d={`M${x},${y - 18} q4,-22 14,-30`} stroke="#5b3a1d" strokeWidth={2} fill="none" strokeLinecap="round" />
              <circle cx={x} cy={y - 12} r={9} fill="#a8121f" />
              <circle cx={x - 3} cy={y - 15} r={2.4} fill="#fff" opacity={0.5} />
            </g>
          ))}
        </g>
      );
    case 'rosettes':
      return (
        <g>
          {[74, 124, 175, 225, 276, 326].map((x, i) => (
            <g key={i} transform={`translate(${x} ${y - 6}) scale(1.25)`}>
              <circle r={16} fill={frosting.color} />
              <path d="M0,0 m-10,0 a10,10 0 1,0 20,0 a7,7 0 1,0 -14,0 a4,4 0 1,0 8,0" fill="none" stroke="#e2a2a6" strokeWidth={2.2} strokeLinecap="round" />
            </g>
          ))}
        </g>
      );
    case 'flower':
      return (
        <g>
          {[
            { x: 140, s: 1.1, c: '#f3b8c2' },
            { x: 250, s: 0.9, c: '#f6d27a' },
          ].map((f, i) => (
            <g key={i} transform={`translate(${f.x} ${y - 22}) scale(${f.s})`}>
              <path d="M-22,14 q-18,-6 -26,4 q14,10 26,-4 Z" fill="#6b8f3a" />
              <path d="M22,14 q18,-6 26,4 q-14,10 -26,-4 Z" fill="#6b8f3a" />
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx={0} cy={-12} rx={8} ry={13} fill={f.c} transform={`rotate(${a})`} />
              ))}
              <circle r={6} fill="#e8a33c" />
            </g>
          ))}
        </g>
      );
    case 'stars':
      return (
        <g>
          {[
            { x: 110, s: 1, c: '#f6d27a' },
            { x: 200, s: 1.3, c: '#ffffff' },
            { x: 292, s: 0.9, c: '#f6d27a' },
          ].map((st, i) => (
            <path
              key={i}
              transform={`translate(${st.x} ${y - 20}) scale(${st.s})`}
              d="M0,-18 L5,-6 L18,-6 L8,2 L12,15 L0,7 L-12,15 L-8,2 L-18,-6 L-5,-6 Z"
              fill={st.c}
              stroke="#e2b54d"
              strokeWidth={1}
              strokeLinejoin="round"
            />
          ))}
          {[150, 250, 330, 75].map((x, i) => (
            <circle key={i} cx={x} cy={y - 6} r={4} fill={i % 2 ? '#f4a6b7' : '#ffffff'} />
          ))}
        </g>
      );
    case 'fruit':
      return (
        <g>
          <g transform={`translate(118 ${y - 14})`}>
            <circle r={17} fill="#7fae3a" />
            <circle r={13} fill="#a9cf5a" />
            <circle r={4} fill="#f2f0d8" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <circle key={a} cx={0} cy={-8} r={1.2} fill="#1d1d10" transform={`rotate(${a})`} />
            ))}
          </g>
          <g transform={`translate(214 ${y - 6})`}>
            <path d="M0,-30 C-15,-30 -19,-16 -14,-6 C-10,2 -4,6 0,8 C4,6 10,2 14,-6 C19,-16 15,-30 0,-30 Z" fill="#c22a35" />
            <path d="M-9,-30 L0,-36 L9,-30 L3,-28 L0,-33 L-3,-28 Z" fill="#4f7a2b" />
          </g>
          {[170, 272, 300, 82, 320].map((x, i) => (
            <circle key={i} cx={x} cy={y - 8 - (i % 2) * 6} r={7} fill="#3c3a78" />
          ))}
        </g>
      );
  }
};

/* ------------------------------------ tajada ------------------------------------ */

export const CakeSlice: React.FC<CakeSliceProps> = ({ choice, intro = false, className }) => {
  const uid = useId().replace(/:/g, '');
  const texture = `miga-${uid}`;
  const sheen = `brillo-${uid}`;
  const board = `base-${uid}`;
  const root = useRef<SVGSVGElement>(null);
  const prev = useRef<CakeChoice | null>(null);
  const { sponge, filling1, filling2, frosting } = choice;

  const label = `Tajada de torta: bizcocho de ${sponge.label.toLowerCase()}, rellenos de ${filling1.label.toLowerCase()} y ${filling2.label.toLowerCase()}, cobertura ${frosting.label.toLowerCase()}.`;

  const topPath = useMemo(() => {
    const r = rng(41);
    const pts: string[] = [];
    for (let x = X0 + 10; x <= X1 - 10; x += 22) pts.push(`${x},${(TOP_Y + (r() - 0.5) * 2).toFixed(1)}`);
    return `M${X0},${layerTop.s3 + 2} L${X0},${TOP_Y + 10} Q${X0},${TOP_Y} ${X0 + 10},${TOP_Y} L${pts.join(' L')} L${X1 - 10},${TOP_Y} Q${X1},${TOP_Y} ${X1},${TOP_Y + 10} L${X1},${layerTop.s3 + 2} Z`;
  }, []);

  // Asentar las capas que cambiaron (o todas, la primera vez)
  useLayoutEffect(() => {
    const svg = root.current;
    if (!svg || prefersReducedMotion()) {
      prev.current = choice;
      return;
    }
    const q = (sel: string) => [...svg.querySelectorAll<SVGGElement>(sel)];
    const before = prev.current;
    prev.current = choice;

    const settle = (els: Element[], from = 0.35, delay = 0) =>
      gsap.fromTo(
        els,
        { y: -16, scaleY: 1.05, opacity: from },
        { y: 0, scaleY: 1, opacity: 1, duration: 0.7, ease: SETTLE, stagger: 0.07, delay, transformOrigin: '50% 100%', overwrite: 'auto' },
      );

    if (!before) {
      if (!intro) return;
      const order = ['[data-part="board"]', '[data-layer="s1"]', '[data-layer="f1"]', '[data-layer="s2"]', '[data-layer="f2"]', '[data-layer="s3"]', '[data-part="frosting"]', '[data-part="toppings"]'];
      const els = order.flatMap(q);
      gsap.set(els, { opacity: 0 });
      const io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        settle(els, 0, 0.15);
      }, { threshold: 0.35 });
      io.observe(svg);
      return () => io.disconnect();
    }

    if (before.sponge.id !== sponge.id) settle(q('[data-layer^="s"]'));
    if (before.filling1.id !== filling1.id) settle(q('[data-layer="f1"]'));
    if (before.filling2.id !== filling2.id) settle(q('[data-layer="f2"]'));
    if (before.frosting.id !== frosting.id) settle([...q('[data-part="frosting"]'), ...q('[data-part="toppings"]')]);
  }, [choice, sponge.id, filling1.id, filling2.id, frosting.id, intro]);

  // Reposo: la gota de ganache baja y vuelve, muy lento. Solo en pantalla.
  useLayoutEffect(() => {
    const svg = root.current;
    if (!svg || !frosting.drip || prefersReducedMotion()) return;
    const drops = svg.querySelectorAll('[data-drip]');
    const tween = gsap.to(drops, {
      scaleY: 1.12,
      duration: 3.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: { each: 0.45, from: 'random' },
      transformOrigin: '50% 0%',
      paused: true,
    });
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? tween.play() : tween.pause()));
    io.observe(svg);
    return () => {
      io.disconnect();
      tween.kill();
    };
  }, [frosting.drip, frosting.id]);

  return (
    <svg ref={root} viewBox="0 0 400 430" className={`${className ?? ''}${intro ? ' is-intro' : ''}`} role="img" aria-label={label}>
      <defs>
        <filter id={texture} x="0" y="0" width="100%" height="100%">
          {/* Miga: puntos donde el ruido es alto, con el color de la miga (SourceGraphic) */}
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={7} result="ruido" />
          <feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 3.2 -1.7" result="mascara" />
          <feComposite in="SourceGraphic" in2="mascara" operator="in" />
        </filter>
        <linearGradient id={sheen} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={board} x1="0" x2="1">
          <stop offset="0" stopColor="#a9822f" />
          <stop offset="0.5" stopColor="#e2c06b" />
          <stop offset="1" stopColor="#a9822f" />
        </linearGradient>
      </defs>

      {/* Base dorada y su sombra */}
      <g data-part="board">
        <ellipse cx={200} cy={406} rx={176} ry={10} fill="#000" opacity={0.18} />
        <rect x={14} y={BASE - 2} width={372} height={14} rx={7} fill={`url(#${board})`} />
      </g>

      <Sponge id="s1" opt={sponge} seed={11} texture={texture} />
      <Filling id="f1" opt={filling1} seed={23} />
      <Sponge id="s2" opt={sponge} seed={31} texture={texture} />
      <Filling id="f2" opt={filling2} seed={43} />
      <Sponge id="s3" opt={sponge} seed={53} texture={texture} />

      {/* Cobertura: tapa, costados y gotas */}
      <g data-part="frosting">
        <rect x={X0} y={TOP_Y + 8} width={9} height={BASE - TOP_Y - 8} fill={frosting.edge} />
        <rect x={X1 - 9} y={TOP_Y + 8} width={9} height={BASE - TOP_Y - 8} fill={frosting.edge} />
        <path d={topPath} fill={frosting.color} />
        <rect x={X0 + 20} y={TOP_Y + 4} width={X1 - X0 - 40} height={5} rx={2.5} fill={`url(#${sheen})`} />
        {frosting.drip &&
          DRIPS.map((d) => (
            <path
              key={d.x}
              data-drip=""
              d={`M${d.x - d.w / 2},${layerTop.s3 - 2} L${d.x - d.w / 2},${layerTop.s3 + d.len - d.w / 2} a${d.w / 2},${d.w / 2} 0 0,0 ${d.w},0 L${d.x + d.w / 2},${layerTop.s3 - 2} Z`}
              fill={frosting.color}
            />
          ))}
      </g>

      <g data-part="toppings">
        <Toppings frosting={frosting} />
      </g>
    </svg>
  );
};
