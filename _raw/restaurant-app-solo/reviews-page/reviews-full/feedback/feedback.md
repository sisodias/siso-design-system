<!-- Feedback tracker for Reviews workstreams. Update as items are addressed. -->

# Reviews Feedback Log

Use this living document to capture and resolve feedback specific to the reviews domain.

## How to use

1. Add new feedback items to the **Open Items** table with the date, source, and a short summary.
2. Update the **Status** column as work progresses (for example: `new`, `in-progress`, `blocked`, `done`).
3. Once an item is completed, move it to **Resolved Items** so we preserve the history.

## Open Items

| Date (YYYY-MM-DD) | Source / Owner | Summary | Status | Notes |
| --- | --- | --- | --- | --- |
| 2025-10-31 | Client voice transcript | Ensure star filters display accurate counts (no zero placeholders) | new | Hook up rating filters to backend data |

## Resolved Items

| Date (YYYY-MM-DD) | Source / Owner | Summary | Resolution Date | Notes |
| --- | --- | --- | --- | --- |
| 2025-10-31 | Client voice transcript | Route "Write a review" CTA primarily to Google Reviews (with in-app fallback) and reward loyalty points | 2025-10-31 | Implemented in `WriteReviewButton`, `GuestFeedbackClient`, and client config |
| 2025-10-31 | Client voice transcript | Refresh review cards with brighter/on-brand background styling | 2025-10-31 | Primary card restyled; dark `noir` variant registered |
| 2025-10-31 | Client voice transcript | Pull Google review photos into the carousel | 2025-10-31 | Fallback photo map merges static Google assets into review grid |
