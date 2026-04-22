import { getAllComponents } from '@/lib/registry'
import ComponentGrid from '@/components/ComponentGrid'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const components = await getAllComponents()
  return (
    <div className="pl-64 min-h-screen">
      <ComponentGrid components={components} />
    </div>
  )
}
