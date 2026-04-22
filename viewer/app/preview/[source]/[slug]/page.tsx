import { notFound } from 'next/navigation'
import { getComponent } from '@/lib/registry'
import PreviewRenderer from '@/components/PreviewRenderer'

interface Props {
  params: Promise<{ source: string; slug: string }>
}

export const dynamic = 'force-dynamic'

export default async function PreviewPage({ params }: Props) {
  const { source, slug } = await params
  const component = await getComponent(decodeURIComponent(source), decodeURIComponent(slug))
  if (!component) notFound()

  if (component.preview?.renderable === false) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 p-6 text-center">
        <div className="text-neutral-500">
          <div className="text-xs">Preview not renderable</div>
          <div className="mt-1 text-[10px] opacity-60">
            {component.preview?.reason || 'Open detail page for code'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-neutral-950">
      <PreviewRenderer source={component.source} slug={component.name} />
    </div>
  )
}
