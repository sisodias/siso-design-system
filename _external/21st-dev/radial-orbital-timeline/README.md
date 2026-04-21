# RadialOrbitalTimeline

## What it is
An animated radial orbital timeline component with auto-rotating nodes, expandable detail cards, and connected node navigation.

## What it's used for
- Project timeline visualization
- Event/milestone tracking
- Interactive data visualization

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| timelineData | TimelineItem[] | required | Array of timeline nodes |
| timelineData[].id | number | required | Unique identifier |
| timelineData[].title | string | required | Node label |
| timelineData[].date | string | required | Date string |
| timelineData[].content | string | required | Description text |
| timelineData[].category | string | required | Category label |
| timelineData[].icon | React.ElementType | required | Lucide icon component |
| timelineData[].relatedIds | number[] | required | IDs of connected nodes |
| timelineData[].status | "completed" \| "in-progress" \| "pending" | required | Node status |
| timelineData[].energy | number (0-100) | required | Energy level for glow effect |

## Dependencies
- `lucide-react` — icons (ArrowRight, Link, Zap)
- `@/components/ui/badge` — shadcn badge
- `@/components/ui/button` — shadcn button
- `@/components/ui/card` — shadcn card

## Source
21st.dev

## Tags
timeline, radial, orbital, animated, interactive, visualization
