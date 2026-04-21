import { getComponent, getComponentFiles } from '@/lib/walk'
import { getReadmeContent } from '@/lib/readme'
import { readAllComponentFiles } from '@/lib/files'
import SourceBadge from '@/components/SourceBadge'
import CopyPathButton from '@/components/CopyPathButton'
import CodeBlock from '@/components/CodeBlock'
import LivePreview from '@/components/LivePreview'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { codeToHtml } from 'shiki'

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

  // Read file contents and render syntax-highlighted HTML
  const fileData = await readAllComponentFiles(component.folderPath, files)

  const fileBlocks = await Promise.all(
    fileData.map(async (f) => {
      const html = await codeToHtml(f.content, {
        lang: f.language,
        theme: 'github-dark',
      })
      return { name: f.name, content: f.content, html }
    })
  )

  const autoOpen = fileBlocks.length <= 5

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
        {/* Live preview — full width, natural-centered */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-neutral-400">Live Preview</h2>
          <div
            className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 isolate"
            style={{
              contain: 'strict',
              ['--preview-scale' as string]: '1',
            }}
          >
            <LivePreview
              source={component.source}
              slug={component.name}
              mode="natural-centered"
              inert={false}
            />
          </div>
        </section>

        {/* Code files section FIRST — priority for Shaan */}
        {fileBlocks.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-400">
              Files ({fileBlocks.length})
            </h2>
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
              {fileBlocks.map((block, i) => (
                <CodeBlock
                  key={block.name}
                  filename={block.name}
                  content={block.content}
                  html={block.html}
                  defaultOpen={autoOpen && i === 0}
                />
              ))}
            </div>
          </section>
        )}

        {/* README section — below code */}
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
      </main>
    </div>
  )
}
