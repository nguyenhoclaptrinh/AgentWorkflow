---
name: frontend-design
description: This skill should be used for creating distinctive, production-grade frontend interfaces. Activates when users request web components, pages, or applications. Generates creative, polished code with exceptional aesthetics, modern CSS features (View Transitions, Container Queries), purposeful animations, and avoids generic AI aesthetics. Includes code patterns for planners.
license: MIT
version: 2.0.0
---

# Frontend Design Skill

Create distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics.

## Design Thinking (Before Coding)

1. **Purpose** - What problem? Who uses it?
2. **Tone** - Choose BOLD direction: brutalist, maximalist, retro-futuristic, luxury, editorial, organic, art-deco, soft/pastel, industrial, playful
3. **Differentiation** - What makes this UNFORGETTABLE?
4. **Constraints** - Framework, performance, accessibility requirements

**CRITICAL:** Commit to a clear aesthetic direction. Bold maximalism and refined minimalism both work—the key is intentionality.

## Quick Implementation Checklist

```
[ ] Distinctive typography (see references/typography.md)
[ ] Cohesive color palette with CSS variables (see references/colors.md)
[ ] Purposeful animations (see references/animations.md)
[ ] Modern CSS features where appropriate (see references/css-modern.md)
[ ] Avoided all anti-patterns (see references/anti-patterns.md)
```

## Core Aesthetic Principles

| Element | Approach |
|---------|----------|
| Typography | Variable fonts, distinctive display + refined body pairing |
| Color | Dominant colors with sharp accents, CSS variables |
| Motion | High-impact moments, staggered reveals, scroll-triggered |
| Layout | Asymmetry, overlap, grid-breaking, generous whitespace |
| Depth | Gradient meshes, noise textures, layered transparencies |

## NEVER Use (Generic AI Aesthetics)

- Inter, Roboto, Arial, system fonts as primary
- Purple gradients on white backgrounds
- Predictable card grids with rounded corners
- Cookie-cutter shadows and borders
- Same aesthetic across different projects

## Modern CSS (2025)

Use when appropriate:
- **View Transitions API** - Seamless page/view transitions
- **Container Queries** - Component-based responsive design
- **Scroll-driven Animations** - CSS-only scroll effects
- **`clamp()` / `min()` / `max()`** - Intrinsic responsive sizing

See `references/css-modern.md` for code patterns.

## Animation Strategy

| Context | Tool |
|---------|------|
| React micro-interactions | Framer Motion |
| Complex timelines/SVG | GSAP + ScrollTrigger |
| Simple effects | CSS transitions/animations |
| Page transitions | View Transitions API |

See `references/animations.md` for implementation patterns.

## Output Requirements

- Production-grade, functional code
- Visually striking and memorable
- Cohesive aesthetic point-of-view
- Meticulously refined details
- Accessible (WCAG, keyboard nav, reduced motion)
- Performance-optimized (60fps animations)

## References

- `references/typography.md` - Font choices, variable fonts, pairings
- `references/colors.md` - Palettes, trends, CSS variable patterns
- `references/animations.md` - Framer Motion, GSAP, CSS patterns
- `references/css-modern.md` - View Transitions, Container Queries, scroll-driven
- `references/anti-patterns.md` - What to avoid, common mistakes
- `references/code-patterns.md` - Reusable snippets for planners
