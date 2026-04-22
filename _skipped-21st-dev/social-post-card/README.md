# SocialPostCard

## What it is
A social media post card with author header, text content, optional link preview box, and engagement footer (likes, comments, shares) with bookmark toggle.

## What it's used for
- Social feed UIs
- Timeline components
- Community/discussion pages
- Messaging app post previews

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| id | string | username | Unique card ID |
| author | object | Dorian Baffier | Author info (name, username, avatar, timeAgo) |
| content | object | - | Post text and optional link preview |
| engagement | object | 128/32/24 likes | Engagement stats and toggle states |
| onLike | () => void | - | Like button callback |
| onComment | () => void | - | Comment button callback |
| onShare | () => void | - | Share button callback |
| onBookmark | () => void | - | Bookmark toggle callback |

## Notes
- Uses `backdrop-blur-lg` and semi-transparent backgrounds for frosted glass effect
- Heart icon fills when `isLiked` is true
- Bookmark icon turns yellow when `isBookmarked` is true
- Link preview box is optional — only renders when `content.link` is provided
- All interactive elements (buttons, bookmark) need callback handlers for full functionality

## Source
21st.dev