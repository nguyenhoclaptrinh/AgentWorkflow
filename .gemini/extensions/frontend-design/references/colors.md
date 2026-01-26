# Color Palettes & Trends

Distinctive color approaches for 2025.

## Trending Palettes

| Palette | Colors |
|---------|--------|
| Mocha Mousse (2025) | `#4a3728` `#a47764` `#d4c4bc` `#f5f0eb` `#c17f59` |
| Vibrant Electric | `#0066ff` `#ff6b35` `#ff0080` `#0a0a1a` `#fafafa` |
| Nature-Inspired | `#2d5a3d` `#87a878` `#e8dcc4` `#1a4a5e` `#e07b53` |
| Dark + Neon | `#0d0d0d` `#1a1a1a` `#00ffff` `#ff00ff` `#39ff14` |

## Chromatic Gradients

```css
/* Multi-dimensional gradient */
.gradient-mesh {
  background:
    radial-gradient(at 20% 80%, #ff6b35 0%, transparent 50%),
    radial-gradient(at 80% 20%, #0066ff 0%, transparent 50%),
    radial-gradient(at 50% 50%, #ff0080 0%, transparent 70%),
    #0a0a1a;
}

/* Animated gradient */
.gradient-animate {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

## CSS Variable System

```css
:root {
  /* Semantic colors */
  --color-primary: var(--electric-blue);
  --color-secondary: var(--hot-orange);
  --color-accent: var(--magenta);

  /* Surface colors */
  --color-bg: var(--off-white);
  --color-surface: white;
  --color-text: var(--deep-navy);
  --color-text-muted: #666;

  /* State colors */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}

/* Dark mode override */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: var(--bg-dark);
    --color-surface: var(--surface);
    --color-text: var(--text);
  }
}
```

## Color Contrast Utility

Always verify: text vs background >= 4.5:1 ratio (WCAG AA)
