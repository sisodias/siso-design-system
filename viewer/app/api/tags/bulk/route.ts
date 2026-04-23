import { NextRequest, NextResponse } from 'next/server'
import { bulkTags } from '@/lib/curation'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { source, slug, add, remove } = body

    if (!source || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: source, slug' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }

    const result = bulkTags(source, slug, add, remove)

    return NextResponse.json(
      result,
      { headers: { 'Access-Control-Allow-Origin': '*' } },
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    const status = msg.includes('unavailable on Cloudflare Workers') ? 503 : 500
    const error = status === 503 ? 'Tag system unavailable in cloud deployment (local-only feature)' : 'Failed to bulk-update tags'
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
