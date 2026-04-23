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
    return NextResponse.json(
      { error: 'Failed to list tags' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } },
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
