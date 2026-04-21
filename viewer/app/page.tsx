import { getAllComponents } from '@/lib/walk'
import ComponentGrid from '@/components/ComponentGrid'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const components = await getAllComponents()
  return <ComponentGrid components={components} />
}
