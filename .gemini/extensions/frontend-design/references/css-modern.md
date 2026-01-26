# Modern CSS Features (2025)

Production-ready CSS features for distinctive interfaces.

## View Transitions API

Seamless page/view transitions without JavaScript animation libraries.

```css
/* Enable view transitions */
@view-transition { navigation: auto; }

/* Custom transition animations */
::view-transition-old(root) {
  animation: fade-out 0.3s ease-out;
}
::view-transition-new(root) {
  animation: fade-in 0.3s ease-in;
}

/* Named transitions for specific elements */
.hero-image { view-transition-name: hero; }

::view-transition-old(hero),
::view-transition-new(hero) {
  animation-duration: 0.5s;
}
```

### React/Next.js Integration
```tsx
// Trigger view transition
document.startViewTransition(() => {
  // Update DOM or navigate
  router.push('/new-page');
});
```

## Container Queries

```css
.card-container { container-type: inline-size; container-name: card; }
@container card (min-width: 400px) { .card { display: grid; grid-template-columns: 1fr 2fr; } }
@container card (max-width: 399px) { .card { flex-direction: column; } }
```

## Scroll-Driven Animations

```css
@keyframes reveal { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
.scroll-reveal { animation: reveal linear; animation-timeline: view(); animation-range: entry 0% cover 40%; }

/* Progress bar */
.progress-bar { animation: grow linear; animation-timeline: scroll(); }
@keyframes grow { to { transform: scaleX(1); } }
```

## Fluid Typography & Spacing

```css
:root {
  /* Fluid font size */
  --fluid-lg: clamp(1.5rem, 1rem + 2vw, 3rem);

  /* Fluid spacing */
  --space-sm: clamp(0.5rem, 0.25rem + 1vw, 1rem);
  --space-md: clamp(1rem, 0.5rem + 2vw, 2rem);
  --space-lg: clamp(2rem, 1rem + 4vw, 6rem);
}
```

## Custom Scrollbar

```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--color-bg); }
::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 4px;
}
/* Firefox */
* { scrollbar-width: thin; scrollbar-color: var(--color-primary) var(--color-bg); }
```

## Has Selector (Parent Selection)

```css
/* Style parent based on child state */
.form-group:has(input:focus) {
  border-color: var(--color-primary);
}
.card:has(img) {
  padding-top: 0;
}
```
