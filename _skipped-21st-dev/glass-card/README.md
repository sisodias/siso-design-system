# GlassCard

## What it is
A premium 3D glass-morphism card with hover tilt effects, layered depth, animated social icons, and concentric decorative circles.

## What it's used for
- Hero section cards
- Product/service showcases
- Profile cards with social links
- Interactive UI showcases

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | - | Additional Tailwind classes |

## Notes
- Uses Tailwind arbitrary values for 3D transforms (`[perspective:1000px]`, `[transform-style:preserve-3d]`, etc.)
- Hover triggers 3D rotation and reveals shadow depth
- Social buttons animate outward on card hover
- Concentric circles animate outward with staggered delays
- Dependencies: `lucide-react`

## Source
21st.dev