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
    return NextResponse.json(
      { error: 'Failed to bulk-update tags' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } },
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
