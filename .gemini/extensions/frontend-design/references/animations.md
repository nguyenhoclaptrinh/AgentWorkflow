# Animation Patterns

Purposeful motion for modern interfaces.

## Framer Motion (React)

### Basic Fade-In
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
>
  Content
</motion.div>
```

### Staggered + Scroll-Triggered
```tsx
// Stagger: use variants with staggerChildren
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
<motion.ul variants={container} initial="hidden" animate="show">...</motion.ul>

// Scroll: use whileInView
<motion.div whileInView={{ opacity: 1 }} viewport={{ once: true }}>...</motion.div>

// Page transitions: AnimatePresence + key
<AnimatePresence mode="wait">
  <motion.div key={pathname} initial={{...}} animate={{...}} exit={{...}}>{children}</motion.div>
</AnimatePresence>
```

## GSAP (Complex/Timeline)

### Basic Timeline
```js
import gsap from 'gsap';

const tl = gsap.timeline();
tl.from('.hero-title', { opacity: 0, y: 50, duration: 0.8 })
  .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.6 }, '-=0.4')
  .from('.hero-cta', { opacity: 0, scale: 0.9, duration: 0.5 }, '-=0.3');
```

### ScrollTrigger
```js
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

gsap.from('.section', {
  scrollTrigger: {
    trigger: '.section',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1
  },
  opacity: 0,
  y: 100
});
```

## CSS-Only Animations

### Hover Lift
```css
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Performance Rules

- Animate only `transform` and `opacity`
- Use `will-change` sparingly
- Target 60fps (16ms per frame)
- Lazy-load heavy animations
