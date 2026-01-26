# Typography Guidelines

Distinctive typography choices that avoid generic AI aesthetics.

## Variable Fonts (2025 Standard)

Single file, all weights/widths. Better performance + creative control.

```css
/* Variable font with weight range */
@font-face {
  font-family: 'DisplayFont';
  src: url('/fonts/display-variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

.heading {
  font-family: 'DisplayFont', serif;
  font-weight: 800;
  font-variation-settings: 'wght' 800, 'wdth' 110;
}
```

## Distinctive Display Fonts (NOT Inter/Roboto)

| Aesthetic | Font Suggestions |
|-----------|------------------|
| Editorial/Luxury | Playfair Display, Cormorant, Freight Display |
| Brutalist/Raw | Monument Extended, Clash Display, Bebas Neue |
| Retro/Vintage | Recoleta, Fraunces, Cooper Black |
| Tech/Futuristic | Orbitron, Exo 2, Audiowide |
| Organic/Soft | Quicksand, Nunito, Comfortaa |
| Art Deco | Poiret One, Josefin Sans, Cinzel |

## Body Font Pairings

| Display Font | Body Pairing |
|--------------|--------------|
| Playfair Display | Source Serif Pro, Lora |
| Monument Extended | DM Sans, Satoshi |
| Recoleta | Karla, Work Sans |
| Clash Display | General Sans, Plus Jakarta Sans |

## Typography Scale (Fluid)

```css
:root {
  --font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --font-size-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);
  --font-size-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --font-size-lg: clamp(1.25rem, 1rem + 1vw, 1.5rem);
  --font-size-xl: clamp(1.5rem, 1rem + 2vw, 2.5rem);
  --font-size-2xl: clamp(2rem, 1rem + 4vw, 4rem);
  --font-size-hero: clamp(3rem, 2rem + 6vw, 8rem);
}
```

## Kinetic Typography (Motion)

```css
/* Staggered text reveal */
.text-reveal span {
  display: inline-block;
  opacity: 0;
  transform: translateY(100%);
  animation: reveal 0.6s ease forwards;
}
.text-reveal span:nth-child(1) { animation-delay: 0.1s; }
.text-reveal span:nth-child(2) { animation-delay: 0.2s; }
/* ... */

@keyframes reveal {
  to { opacity: 1; transform: translateY(0); }
}
```

## Accessibility

- Minimum 16px body text
- Line height 1.5-1.7 for body
- Contrast ratio 4.5:1 minimum
- Avoid all-caps for long text
