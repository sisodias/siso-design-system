# FreelancerStatsCard

## What it is
A comprehensive freelancer dashboard card showing earnings, project/client stats, ranking, and animated availability chart with gradient bars.

## What it's used for
- Freelancer profile widgets
- Earnings/analytics dashboards
- Availability tracking

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | required | Card header title |
| timeFrame | string | required | Time period label |
| earnings | { amount, change, changePeriod } | required | Earnings data with change indicator |
| subStats | [SubStat, SubStat] | required | Two sub-stat boxes (projects, clients) |
| ranking | { place, category, icon? } | required | Ranking display with optional icon |
| availability | { title, bars, label } | required | Availability chart data |
| className | string | - | Additional CSS classes |

## Features
- Animated availability bar chart with gradient colors
- Currency formatting with Intl.NumberFormat
- Positive/negative earnings change highlighting
- Staggered Framer Motion animations for bar chart
- Responsive max-width card layout
- Accessibility attributes (aria-label)

## Dependencies
- `framer-motion`
- `@/lib/utils` (cn helper from shadcn)

## Source
21st.dev

## Tags
freelancer, stats, earnings, dashboard, card, availability, animated
