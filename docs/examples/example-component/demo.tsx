"use client"

import ExampleComponent from "./example-component"

/**
 * Standalone demo — renders the component at a size that looks good in the
 * 400x300 preview frame (matches `preview.width` / `preview.height` in
 * registry-item.json).
 *
 * Rules:
 * - Default export OR named export `DemoOne`
 * - Use `"use client"` if the demo uses hooks/state/motion
 * - No auth, cart, or external data fetching
 * - Pass concrete sample values to every prop
 */
export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <ExampleComponent
        title="Hello from the example"
        subtitle="This is the demo standard"
      />
    </div>
  )
}
