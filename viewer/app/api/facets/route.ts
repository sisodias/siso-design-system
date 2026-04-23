import { readFileSync } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export function GET() {
  const manifestPath = path.resolve(process.cwd(), '../library/manifest.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
  return NextResponse.json(manifest.facets)
}
