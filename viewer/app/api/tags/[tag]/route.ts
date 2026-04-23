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
    return NextResponse.json(
      { error: 'Failed to list components for tag' },
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
