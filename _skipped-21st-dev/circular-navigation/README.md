# CircularNavigation

## What it is
A full-screen circular navigation menu that displays nav items arranged in a circle with an animated open/close transition.

## What it's used for
- Mobile navigation menus
- App menu overlays
- Landing page navigation
- Dashboard navigation menus

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| navItems | NavItem[] | Yes | Array of navigation items with name, icon, and href |
| isOpen | boolean | Yes | Controls visibility of the menu |
| toggleMenu | () => void | Yes | Callback to toggle menu state |

### NavItem interface
| Property | Type | Description |
|----------|------|-------------|
| name | string | Display label for the nav item |
| icon | React.ComponentType | Lucide icon component |
| href | string | Link destination |

## Source
21st.dev

## Tags
navigation, menu, circular, overlay, modal, animated

## Dependencies
- framer-motion (animation)
- lucide-react (icons)
- next/link (routing)
- @radix-ui/react-slot (button asChild)
- class-variance-authority (button variants)
