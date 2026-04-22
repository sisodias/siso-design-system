# NotificationsMenu

## What it is
A comprehensive notifications panel with tabbed filtering (All/Verified/Mentions), avatar-based notification items, file attachments, and action buttons.

## What it's used for
- Notification centers
- Social app notification panels
- Dashboard notification dropdowns
- Team collaboration app notification feeds

## Props
Exports `Component` — a self-contained React component with internal state management via `useState`.

### Notification types supported
- `comment` — with quoted content preview
- `follow` — verified interaction
- `invitation` — with Accept/Decline buttons
- `file_share` — with file metadata and download button
- `mention` — with @mention content
- `like` — verified interaction

## Source
21st.dev

## Tags
notifications, feed, tabs, social, dashboard, avatar

## Dependencies
- @radix-ui/react-avatar
- @radix-ui/react-tabs
- @radix-ui/react-slot
- class-variance-authority
- @radix-ui/react-label
- shadcn/ui (avatar, badge, button, card)
