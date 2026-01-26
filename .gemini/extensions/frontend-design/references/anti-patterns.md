# Anti-Patterns to Avoid

Common mistakes that create generic, dated, or poor-quality interfaces.

## Generic AI Aesthetics (NEVER)

| Pattern | Why It's Bad |
|---------|--------------|
| Inter/Roboto/Arial everywhere | Zero personality, instantly recognizable as AI-generated |
| Purple gradients on white | Overused in AI tools, screams "generated" |
| Uniform rounded corners | Cookie-cutter appearance |
| Card grids with identical shadows | Predictable, boring |
| Generic stock photos | Inauthentic, disconnected |
| Same palette across projects | Lack of contextual design thinking |

## Visual Design Failures

**Cluttered Interfaces**
- Too many elements competing for attention
- Missing visual hierarchy
- Insufficient whitespace
- Solution: Ruthless prioritization, clear focal points

**Weak Color Choices**
- Timid, evenly-distributed palettes
- No clear dominant/accent relationship
- Poor contrast ratios
- Solution: Bold dominant + sharp accents, verify WCAG

**Forgettable Typography**
- System fonts as primary display
- Single font family throughout
- Generic weights (400/700 only)
- Solution: Distinctive display + refined body pairing

## Animation Mistakes

**Overuse**
```css
/* BAD: Everything animates */
* { transition: all 0.3s ease; }
```

**Performance Killers**
```css
/* BAD: Animating layout properties */
.card:hover {
  width: 110%;        /* Triggers layout */
  padding: 30px;      /* Triggers layout */
  border-width: 3px;  /* Triggers layout */
}

/* GOOD: Transform only */
.card:hover {
  transform: scale(1.02);
}
```

**Ignoring Reduced Motion**
```css
/* REQUIRED: Respect user preference */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

## Technical Debt

| Anti-Pattern | Impact |
|--------------|--------|
| Monolithic components | Unmaintainable, hard to test |
| Inline styles everywhere | No theming, inconsistent |
| No CSS variables | Hard to maintain consistency |
| Loading everything upfront | Poor performance |
| No lazy loading | Slow initial load |
| Magic numbers | Unscalable, fragile |

## Accessibility Failures

- Low contrast text (< 4.5:1 ratio)
- No keyboard navigation
- Missing focus indicators
- No alt text on images
- Autoplay audio/video
- Motion without reduced-motion support

## Layout Anti-Patterns

- Horizontal scroll on mobile
- Fixed widths that break responsively
- Desktop-only design
- Z-index chaos (1000, 9999, etc.)
- Absolute positioning abuse
