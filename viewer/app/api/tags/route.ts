import { NextResponse } from 'next/server'
import { listAllTagsWithCounts } from '@/lib/curation'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const tags = listAllTagsWithCounts()
    return NextResponse.json(
      { tags: tags.map(t => ({ name: t.tag, count: t.count })), total: tags.length },
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
    const error = status === 503 ? 'Tag system unavailable in cloud deployment (local-only feature)' : 'Failed to list tags'
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
