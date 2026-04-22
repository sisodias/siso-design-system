# Loader15

## What it is
A hypnotic circular SVG loader with a neon pink-to-orange gradient, blur glow filter, and shadow layer creating a 3D spinning effect.

## What it's used for
- Full-page loading states
- Component lazy-load placeholders
- Submit button loading indicators
- Page transition loaders

## Props
None — self-contained component.

## Notes
- Uses `styled-components` for CSS scoping
- SVG filter creates blur + color matrix glow effect
- Three layered SVGs: main spinner, blur shadow, and defs/filter
- Two animated elements: slow half-circle arc (10s) and fast dashes (3s)
- Gradient: hot pink (#f700a8) → orange (#ff8000)

## Source
21st.dev