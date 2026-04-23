import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import path from 'path'
import type { Manifest } from '@/lib/types'

export const dynamic = 'force-static'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function GET() {
  const manifestPath = path.resolve(process.cwd(), '../library/manifest.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as Manifest

  return NextResponse.json(
    {
      total: manifest.total,
      generatedAt: manifest.generatedAt,
      schemaVersion: manifest.schemaVersion,
      sources: manifest.facets.sources,
      facets: manifest.facets,
    },
    { headers: CORS_HEADERS },
  )
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}
