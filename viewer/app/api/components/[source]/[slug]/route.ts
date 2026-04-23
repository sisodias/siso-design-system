import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { getComponent } from '@/lib/registry'

export const dynamic = 'force-dynamic'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ source: string; slug: string }> },
) {
  const { source, slug } = await params

  const entry = getComponent(source, slug)
  if (!entry) {
    return new NextResponse(null, { status: 404, headers: CORS_HEADERS })
  }

  // Attempt to enrich with classification.json if present on disk
  const classificationPath = path.resolve(
    process.cwd(),
    `../library/${source}/${slug}/classification.json`,
  )

  let extra: Record<string, unknown> = {}
  if (existsSync(classificationPath)) {
    try {
      extra = JSON.parse(readFileSync(classificationPath, 'utf-8'))
    } catch {
      // Ignore parse errors — manifest entry is still returned
    }
  }

  return NextResponse.json({ ...entry, ...extra }, { headers: CORS_HEADERS })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}
