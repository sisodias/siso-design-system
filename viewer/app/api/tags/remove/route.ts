import { NextRequest, NextResponse } from 'next/server'
import { removeTag, getTagsForComponent } from '@/lib/curation'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { source, slug, tag } = body

    if (!source || !slug || !tag) {
      return NextResponse.json(
        { error: 'Missing required fields: source, slug, tag' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } },
      )
    }

    removeTag(source, slug, tag)
    const tags = getTagsForComponent(source, slug)

    return NextResponse.json(
      { tags },
      { headers: { 'Access-Control-Allow-Origin': '*' } },
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to remove tag' },
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
