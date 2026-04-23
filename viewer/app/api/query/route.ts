import { NextRequest, NextResponse } from 'next/server'
import { rank, Brief } from '@/lib/ranker'
import { getAllComponents, getManifest } from '@/lib/registry'

export const dynamic = 'force-dynamic'

// ------------------------------------------------------------------------------------------------
// CORS helpers
// ------------------------------------------------------------------------------------------------

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function corsResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS })
}

// ------------------------------------------------------------------------------------------------
// POST /api/query
// ------------------------------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  let brief: Brief
  try {
    brief = await req.json()
  } catch {
    return corsResponse({ error: 'Invalid JSON body' }, 400)
  }

  const manifest = getManifest()
  const allComponents = getAllComponents()

  const results = rank(allComponents, manifest, brief)

  const total_matched = results.length

  if (total_matched === 0) {
    return corsResponse({
      brief,
      total_matched: 0,
      returned: 0,
      results: [],
      suggestion: "loosen strict filters (try mode: 'loose')",
    })
  }

  const returned = results.length

  return corsResponse({
    brief,
    total_matched,
    returned,
    results,
  })
}

// ------------------------------------------------------------------------------------------------
// OPTIONS preflight
// ------------------------------------------------------------------------------------------------

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}
