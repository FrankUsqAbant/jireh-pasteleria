# JIRÉH · Sistema de diseño

## Brief
- **Quién:** JIRÉH Panadería y Pastelería, Av. San Martín de Porres 787, Cajamarca. Atiende de 2:00 p.m. a 10:00 p.m.
- **Para quién:** familias de Cajamarca que celebran (cumpleaños, infantiles, bodas, quinceaños) y piden desde el celular.
- **Trabajo del sitio:** que el cliente elija o arme su torta y la pida por WhatsApp en menos de un minuto.
- **Tono:** cálido, cercano, de barrio con oficio. Español de Perú.
- **Demo:** es una propuesta para presentar al cliente. Supuestos marcados abajo.

## Concepto: las capas

```
Idea:        La página se arma como una torta: cada sección es una capa, de la cobertura a la base.
Metáfora:    el corte de una torta (cobertura, bizcocho, relleno, bizcocho, base dorada).
Signature:   "El corte": una tajada que se arma en vivo mientras el cliente elige bizcocho,
             rellenos y cobertura. La misma tajada aparece en el hero y baja a "Arma tu torta".
Emoción:     antojo tranquilo. Ver la tajada y querer una.
Verbo:       asentarse como crema. Las cosas bajan unos pixeles y se asientan, lentas y suaves.
Screenshot:  la tajada con capas de manjar blanco y chocolate junto al resumen del pedido.
```

**Ancla:** el negocio vende tortas a medida por capas (bizcocho, dos rellenos, cobertura) y su sello local es el manjar blanco cajamarquino.

Conceptos descartados: B "La vitrina" (de ella tomamos el catálogo en repisas) y C "Proveerá" (riesgo de tono religioso no pedido).

## Paleta (del corte de una torta y del logo)

| Rol | Hex | De dónde sale |
|---|---|---|
| `ganache` (fondo oscuro, tinta sobre claro) | `#2a1710` | la cobertura de chocolate |
| `bizcocho` (fondo claro) | `#f3e4c7` | el bizcocho de vainilla |
| `manjar` (capa de relleno, fondo de "Arma tu torta") | `#d39a5b` | el manjar blanco cajamarquino |
| `muted` (texto secundario) | `#6e4b36` sobre bizcocho · `#d9c3a5` sobre ganache | miga tostada |
| `line` | `rgba(42,23,16,.16)` | |
| `fresa` (acento, poco y con sentido) | `#b3202e` | las fresas y cerezas de las tortas |
| `dorado` (base de la torta, detalles finos) | `#c9a14e` | la base dorada y el aro del logo |

Crema + serif es una señal de IA si no tiene razón: aquí el crema es literal (es el bizcocho) y no hay terracota.

## Tipografía
- **Display:** Young Serif 400 (Google). Redondeada y cálida, conversa con el "JIRÉH" del logo. Interletrado negativo por tamaño.
- **Texto e interfaz:** Host Grotesk 400/500/600 (Google). Cuerpo de 17 a 18 px, interlineado 1.55.
- Sin Playfair, sin emojis en los títulos. Números tabulares en precios.

## Grilla y ritmo
- 12 columnas, margen = gutter (clamp 20 a 48 px). Tres verticales fuertes: col 1, col 6, col 9.
- **Regla de capas:** cada límite entre secciones es una franja de relleno (8 a 14 px de manjar o crema)
  con el borde superior ligeramente irregular, como el corte real. Nunca una ola senoidal decorativa.
- Ritmos: hero a pantalla completa · vitrina amplia · arma tu torta alta (tajada sticky) · cómo pedir
  compacto · visítanos amplio · pie como base.

## Forma
- Radio único: 18 px en tarjetas y fotos, 999 px en botones (como un rosetón). Nada de vidrio esmerilado.

## Movimiento
- Una sola familia de curvas: `asentar = cubic-bezier(.22,1,.36,1)` (CSS) / `power3.out` (GSAP).
- Capas de la tajada: bajan 18 px y se asientan con un leve aplastado (scaleY 1.04 → 1), 0.7 s, desfase 70 ms.
- Botones principales: la crema "rellena" el botón desde abajo (clip-path), y la flecha avanza 4 px.
- Fotos del catálogo: la foto sube 6 px dentro de su marco y aparece la línea de precio.
- Reposo: la gota de ganache de la tajada baja y vuelve muy lento (3 a 4 px, 6 s). Se detiene fuera de pantalla
  y con movimiento reducido.
- Con movimiento reducido: todo visible, sin desplazamientos; los estados se marcan con color y subrayado.
- Sin scroll suave ni secuestro del scroll. Sin loader (es una pastelería, no un lanzamiento).

## Composición

```
HERO (capa: cobertura, ganache)            VITRINA (capa: bizcocho)
+--------------------------------------+   +--------------------------------------+
| logo           tortas  arma  visita WA|   | Tortas de la vitrina      [filtros]  |
|                                      |   | [foto grande] [foto] [foto]          |
| Tortas por capas,      [  TAJADA  ]  |   |               [foto] [foto] [foto]   |
| hechas en Cajamarca.   [  capas   ]  |   | repisas con precio "desde S/ 85"     |
| Pedir por WhatsApp  Arma la tuya     |   +--------------------------------------+
| 2 p.m. a 10 p.m. · San Martín 787    |
+--------------------------------------+   ARMA TU TORTA (capa: manjar)
                                           +--------------------------------------+
COMO PEDIR + RESEÑAS EJEMPLO (bizcocho)    | [TAJADA sticky]  | 1 bizcocho        |
  tres pasos reales en una línea           |                  | 2 rellenos         |
  reseñas marcadas "de ejemplo"            |                  | 3 cobertura        |
  preguntas frecuentes                     |                  | porciones · fecha  |
                                           |                  | resumen + WhatsApp |
VISÍTANOS (bizcocho claro)                 +--------------------------------------+
  dirección grande · horario en vivo · mapa
PIE (capa: base dorada sobre ganache)
```

## Supuestos de la demo (reemplazar en la versión final)
- "Desde 2007", RUC, redes sociales y la mayoría de fotos vienen de la exportación de AI Studio: confirmar con el cliente.
- Reseñas: son de ejemplo y se muestran marcadas como tales.
- Precios "desde" del catálogo: valores de la demo.
