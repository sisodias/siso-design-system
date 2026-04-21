import { getAllComponents } from '@/lib/walk'
import Card from '@/components/Card'
import FilterBar from '@/components/FilterBar'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const components = await getAllComponents()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="mb-4 text-2xl font-semibold">Design System</h1>
          <FilterBar sources={[...new Set(components.map(c => c.source))]} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" id="component-grid">
          {components.length === 0 ? (
            <p className="col-span-full text-neutral-500">No components found. Add components to _raw/ or _external/.</p>
          ) : (
            components.map((component) => (
              <Card key={`${component.source}-${component.name}`} component={component} />
            ))
          )}
        </div>
      </main>
    </div>
  )
}
