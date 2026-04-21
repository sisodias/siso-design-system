import { getAllComponents } from '@/lib/walk'
import ComponentGrid from '@/components/ComponentGrid'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const components = await getAllComponents()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="mb-4 text-2xl font-semibold">Design System</h1>
          <ComponentGrid components={components} />
        </div>
      </header>
    </div>
  )
}
