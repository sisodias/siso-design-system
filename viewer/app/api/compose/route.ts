import { NextRequest, NextResponse } from 'next/server'
import { getComponent } from '@/lib/registry'
import { buildAgentPrompt, buildInstallCommand, buildZipStream, buildShareUrl } from '@/lib/compose'
import type { ComposeFormat, ComposeOptions, ComposeComponent } from '@/lib/compose'
import type { ComponentEntry } from '@/lib/types'

export const dynamic = 'force-dynamic'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const VALID_FORMATS: ComposeFormat[] = ['agent-prompt', 'install', 'zip', 'share', 'registry']

export async function POST(request: NextRequest) {
  let body: { components?: ComposeComponent[]; format?: string; options?: ComposeOptions }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { components, format, options = {} } = body

  // Validate components
  if (!components || !Array.isArray(components) || components.length === 0) {
    return NextResponse.json({ error: 'components must be a non-empty array' }, { status: 400 })
  }
  if (components.length > 100) {
    return NextResponse.json({ error: 'components array exceeds maximum of 100' }, { status: 400 })
  }

  // Validate each component has source + slug
  for (const c of components) {
    if (!c.source || !c.slug) {
      return NextResponse.json({ error: 'Each component must have source and slug' }, { status: 400 })
    }
  }

  // Resolve components from manifest
  const resolved: ComponentEntry[] = []
  const missing: string[] = []
  for (const comp of components) {
    const entry = getComponent(comp.source, comp.slug)
    if (!entry) {
      missing.push(`${comp.source}/${comp.slug}`)
    } else {
      resolved.push(entry)
    }
  }
  if (missing.length > 0) {
    return NextResponse.json(
      { error: 'Components not found in manifest', missing },
      { status: 404 },
    )
  }

  // Validate format
  const fmt = format as ComposeFormat | undefined
  if (!fmt || !VALID_FORMATS.includes(fmt)) {
    return NextResponse.json(
      { error: `format must be one of: ${VALID_FORMATS.join(', ')}` },
      { status: 400 },
    )
  }

  // v1: registry not implemented
  if (fmt === 'registry') {
    return NextResponse.json({ error: 'Registry format is not implemented (v2)' }, { status: 501 })
  }

  // Dispatch by format
  if (fmt === 'agent-prompt') {
    const content = buildAgentPrompt(resolved, options)
    return NextResponse.json({ content, length: content.length }, { headers: CORS_HEADERS })
  }

  if (fmt === 'install') {
    // Determine base URL from request origin when available
    const origin = request.headers.get('origin') ?? undefined
    const baseUrl = origin ? `${origin.replace(/\/$/, '')}` : undefined
    const result = buildInstallCommand(resolved, baseUrl)
    return NextResponse.json(result, { headers: CORS_HEADERS })
  }

  if (fmt === 'share') {
    const url = buildShareUrl(components)
    return NextResponse.json({ url, components: components.length }, { headers: CORS_HEADERS })
  }

  if (fmt === 'zip') {
    const bytes = await buildZipStream(resolved, options)
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="siso-kit.zip"',
        'Content-Length': String(bytes.byteLength),
      },
    })
  }

  return NextResponse.json({ error: 'Unknown format' }, { status: 400 })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}
