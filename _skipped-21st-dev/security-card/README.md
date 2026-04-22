# SecurityCard

## What it is
An animated security/access card component with SVG face outline animation, scrambled text overlay, and dark/light mode support.

## What it's used for
- Identity verification UI
- Smart access control displays
- Security dashboards
- KYC/verification flows

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `delay` | `number` | `5000` | Animation restart interval in ms |
| `name` | `string` | `"Liam Parker"` | Name displayed on card |
| `email` | `string` | `"liam.parker@example.com"` | Email displayed on card |

## CSS Animations Required
Add to your `index.css`:
```css
@keyframes draw-outline {
  from { stroke-dasharray: 160; stroke-dashoffset: 160; }
  to { stroke-dasharray: 160; stroke-dashoffset: 0; }
}
@keyframes draw {
  from { stroke-dasharray: 100; stroke-dashoffset: 100; }
  to { stroke-dasharray: 100; stroke-dashoffset: 0; }
}
```

## Dependencies
- `motion` (motion/react)
- `react-icons` (IoMdCheckmark)
- `@/lib/utils` (cn helper)

## Source
User-provided component
