import { getComponent, getComponentFiles } from '@/lib/walk'
import { getReadmeContent } from '@/lib/readme'
import SourceBadge from '@/components/SourceBadge'
import CopyPathButton from '@/components/CopyPathButton'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ source: string; name: string }>
}

export default async function ComponentPage({ params }: PageProps) {
  const { source, name } = await params
  const decodedName = decodeURIComponent(name)
  const decodedSource = decodeURIComponent(source)

  const component = await getComponent(decodedSource, decodedName)
  if (!component) notFound()

  const readme = await getReadmeContent(component.readmePath)
  const files = await getComponentFiles(component.folderPath)

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-800">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Link href="/" className="mb-4 inline-block text-sm text-neutral-400 hover:text-neutral-200">
            ← Back
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">{component.displayName}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <SourceBadge source={component.source} />
                <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs">
                  {component.platform}
                </span>
              </div>
            </div>
            <CopyPathButton relativePath={component.relativePath} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <section className="mb-8">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-400">README</h2>
          {readme ? (
            <article className="prose prose-invert prose-neutral max-w-none rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {readme}
              </ReactMarkdown>
            </article>
          ) : (
            <p className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 text-neutral-500">
              No README available.
            </p>
          )}
        </section>

        {files.length > 0 && (
          <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-400">Files</h2>
            <ul className="space-y-1">
              {files.map(file => (
                <li key={file} className="flex items-center gap-2 text-sm text-neutral-400">
                  <span className="text-neutral-600">├</span>
                  {file}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}
