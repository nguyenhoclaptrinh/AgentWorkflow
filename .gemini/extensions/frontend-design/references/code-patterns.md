# Code Patterns (for Planners)

Reusable snippets representing latest approaches.

## Base HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DisplayFont:wght@400..900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body><!-- content --><script type="module" src="main.js"></script></body>
</html>
```

## CSS Reset + Variables (2025)

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 100%; scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }

:root {
  --font-display: 'Playfair Display', serif;
  --font-body: 'Source Sans Pro', sans-serif;
  --color-primary: #0066ff;
  --color-bg: #fafafa;
  --color-text: #1a1a1a;
}
```

## React Component (Framer Motion)

```tsx
'use client';
import { motion } from 'framer-motion';

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <h2>{title}</h2>{children}
    </motion.section>
  );
}
```

## Responsive Grid (Container Queries)

```css
.grid-container { container-type: inline-size; }

.grid {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: 1fr;
}
@container (min-width: 600px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
@container (min-width: 900px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

## Button + Hero Patterns

```css
/* Button */
.btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-weight: 600; border: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
.btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.btn:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }

/* Hero */
.hero { min-height: 100vh; display: grid; place-items: center; padding: var(--space-lg); }
.hero-title { font-family: var(--font-display); font-size: var(--font-size-hero); line-height: 1.1; }
```
