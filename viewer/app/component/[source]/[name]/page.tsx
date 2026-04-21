import { getComponent, getComponentFiles } from '@/lib/walk'
import { parseReadme } from '@/lib/readme'
import SourceBadge from '@/components/SourceBadge'
import CopyPathButton from '@/components/CopyPathButton'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'

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

  const readme = await parseReadme(component.readmePath)
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
        {readme && (
          <section className="mb-8 rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
            <h2 className="mb-4 text-lg font-medium">Description</h2>
            <div className="prose prose-invert prose-sm max-w-none">
              {readme.heading && <h3 className="text-xl font-semibold">{readme.heading}</h3>}
              {readme.description && <p className="mt-2 text-neutral-300">{readme.description}</p>}
              {readme.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {readme.tags.map(tag => (
                    <span key={tag} className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {files.length > 0 && (
          <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
            <h2 className="mb-4 text-lg font-medium">Files</h2>
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
