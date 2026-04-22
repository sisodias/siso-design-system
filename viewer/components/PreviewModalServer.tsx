import { getAllComponents } from '@/lib/registry'
import PreviewModal from './PreviewModal'
import { Suspense } from 'react'

export default async function PreviewModalServer() {
  const components = await getAllComponents()
  return (
    <Suspense fallback={null}>
      <PreviewModal components={components} />
    </Suspense>
  )
}
