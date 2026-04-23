import { NextRequest, NextResponse } from 'next/server'
import { listComponentsByTag } from '@/lib/curation'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tag: string }> },
) {
  try {
    const { tag } = await params
    const components = listComponentsByTag(decodeURIComponent(tag))

    return NextResponse.json(
      { tag, components, total: components.length },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      },
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    const status = msg.includes('unavailable on Cloudflare Workers') ? 503 : 500
    const error = status === 503 ? 'Tag system unavailable in cloud deployment (local-only feature)' : 'Failed to list components for tag'
    return NextResponse.json(
      { error },
      { status, headers: { 'Access-Control-Allow-Origin': '*' } },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
