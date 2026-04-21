# AlertCard

## What it is
An animated alert card with spring animations, staggered child reveals, optional icon with pulse animation, dismiss button, and action button.

## What it's used for
- Important notifications / alerts
- Flight reminders
- Call-to-action banners
- Confirmation dialogs

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | Yes | Alert title |
| `description` | `string` | Yes | Alert body text |
| `buttonText` | `string` | Yes | CTA button label |
| `onButtonClick` | `() => void` | Yes | CTA button handler |
| `isVisible` | `boolean` | Yes | Controls visibility (AnimatePresence) |
| `onDismiss` | `() => void` | No | Dismiss button handler |
| `icon` | `ReactNode` | No | Icon displayed with pulse animation |
| `className` | `string` | No | Additional CSS classes |

## Dependencies
- `framer-motion` — animations
- `lucide-react` — icons (X, Bell)
- `button` — `@/components/ui/button`

## Source
User-provided component
