# RadialChart

## What it is
A shadcn-style chart component system wrapping recharts with a custom `Chart` provider, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, and `ChartLegendContent` components using CSS custom properties for theming.

## What it's used for
- Radial/bar charts
- Sales distribution visualizations
- Category breakdowns
- Any recharts-based visualization with shadcn theming

## Exports
- `Chart` — provider wrapper component
- `ChartTooltip` — tooltip wrapper
- `ChartTooltipContent` — styled tooltip content
- `ChartLegend` — legend wrapper
- `ChartLegendContent` — styled legend content
- `ChartStyle` — CSS variable injection for theming
- `ChartConfig` — type for chart configuration
- `useChart` — hook to access chart context

## ChartConfig
```ts
{
  [key: string]: {
    label?: React.ReactNode
    icon?: ComponentType
    color?: string          // light mode color
    theme?: {               // OR light/dark mode colors
      light?: string
      dark?: string
    }
  }
}
```

## Notes
- Requires `recharts` for the actual chart rendering
- Uses `twMerge` from `tailwind-merge` for className merging
- Uses shadcn design tokens: `muted-fg`, `overlay`, `border`, `fg`, `chart-*` CSS variables
- The demo uses `RadialBarChart` from recharts
- Dark mode support via CSS custom properties injected per `[data-chart={id}]`

## Source
21st.dev