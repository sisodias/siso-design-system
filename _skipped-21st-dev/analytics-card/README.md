# AnalyticsCard

## What it is
A responsive analytics dashboard card with an animated bar chart, striped background pattern, and Framer Motion transitions.

## What it's used for
- Dashboard widgets
- Analytics/statistics displays
- Metric tracking cards

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | required | Card header text |
| totalAmount | string | required | Main metric value (e.g. "$242,63") |
| icon | React.ReactNode | required | Icon displayed in header |
| data | { label: string; value: number }[] | [] | Bar chart data |
| className | string | - | Additional CSS classes |

## Features
- Animated bar chart with staggered Framer Motion transitions
- Striped background pattern on bars
- Auto-highlights the bar with the highest value
- Accessibility attributes (aria-label, aria-valuenow)
- Responsive max-width with full-width behavior

## Dependencies
- `framer-motion`
- `@/lib/utils` (cn helper from shadcn)

## Source
21st.dev

## Tags
analytics, card, chart, bar-chart, dashboard, animated, framer-motion
