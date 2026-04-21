# ResizableTable

## What it is
Feature-rich employee data table with drag-to-resize columns, sorting, pagination, row selection, CSV/JSON export, dark mode support, and staggered row animations.

## What it's used for
- Data-dense admin dashboards
- Employee/contact directories
- Sortable, exportable data views

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Employee"` | Table header title |
| `employees` | `Employee[]` | default list | Data rows |
| `onEmployeeSelect` | `(id: string) => void` | — | Row selection callback |
| `onColumnResize` | `(key, width) => void` | — | Column resize callback |
| `className` | `string` | — | Additional CSS classes |
| `enableAnimations` | `boolean` | `true` | Toggle framer-motion animations |

## Source
21st.dev

## Tags
table, resizable, sortable, pagination, export, data-grid
