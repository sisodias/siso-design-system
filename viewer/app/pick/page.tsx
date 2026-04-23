/**
 * viewer/app/pick/page.tsx
 *
 * Server component — reads searchParams (async, Next 15 pattern).
 * Filters components via registry + filters, then renders <PickClient>.
 */

import type { Metadata } from 'next'
import { getFilteredComponents } from '@/lib/registry'
import { parseFilters } from '@/lib/filters'
import { validateSession } from '@/lib/pick'
import PickClient from './PickClient'

// ------------------------------------------------------------------------------------------------
// Accepted search params (all optional)
// ------------------------------------------------------------------------------------------------

interface SearchParams {
  category?: string | string[]
  style?: string | string[]
  industry?: string | string[]
  complexity?: string | string[]
  q?: string
  limit?: string
  mode?: string
  callbackMode?: string
  callbackUrl?: string
  session?: string
  caller?: string
  theme?: string
  preselect?: string
}

// ------------------------------------------------------------------------------------------------
// Page
// ------------------------------------------------------------------------------------------------

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const sp = await searchParams
  return {
    title: `Pick a component${sp.caller ? ` — ${sp.caller}` : ''} | SISO Design System`,
    viewport: 'width=device-width, initial-scale=1',
    other: {
      'theme-color': '#09090b',
    },
  }
}

export default async function PickPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams

  // ----------------------------------------------------------------------------------------------
  // 1. Parse facet params
  // ----------------------------------------------------------------------------------------------

  const raw = {
    category: sp.category,
    style: sp.style,
    industry: sp.industry,
    complexity: sp.complexity,
    q: sp.q,
    pageSize: sp.limit,
  }

  const filters = parseFilters(raw)

  // Override importMode: picker shows ALL components, not just curated
  filters.importMode = 'all'

  // Cap limit at 100
  const limit = Math.min(parseInt(sp.limit ?? '24', 10) || 24, 100)
  filters.pageSize = limit

  // ----------------------------------------------------------------------------------------------
  // 2. Query filtered components
  // ----------------------------------------------------------------------------------------------

  const { items, total } = getFilteredComponents(filters)

  // ----------------------------------------------------------------------------------------------
  // 3. Sort: classified first, then alphabetically
  // ----------------------------------------------------------------------------------------------

  const sorted = [...items].sort((a, b) => {
    if (a.hasClassification !== b.hasClassification) {
      return a.hasClassification ? -1 : 1
    }
    return a.displayName.localeCompare(b.displayName)
  })

  // ----------------------------------------------------------------------------------------------
  // 4. Slice to limit
  // ----------------------------------------------------------------------------------------------

  const sliced = sorted.slice(0, limit)

  // ----------------------------------------------------------------------------------------------
  // 5. Session — validate or generate
  // ----------------------------------------------------------------------------------------------

  const session = validateSession(sp.session ?? null)

  // ----------------------------------------------------------------------------------------------
  // 6. Parse mode + callbackMode
  // ----------------------------------------------------------------------------------------------

  const mode = sp.mode === 'multi' ? 'multi' : 'single'
  const callbackMode =
    sp.callbackMode === 'redirect' || sp.callbackMode === 'webhook'
      ? (sp.callbackMode as 'redirect' | 'webhook')
      : 'postMessage'

  // ----------------------------------------------------------------------------------------------
  // 7. Parse preselect
  // ----------------------------------------------------------------------------------------------

  const preselect: string[] = sp.preselect
    ? sp.preselect
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    : []

  // ----------------------------------------------------------------------------------------------
  // 8. Render
  // ----------------------------------------------------------------------------------------------

  return (
    <PickClient
      components={sliced}
      session={session}
      mode={mode}
      callbackMode={callbackMode}
      callbackUrl={sp.callbackUrl ?? null}
      preselect={preselect}
      caller={sp.caller ?? null}
      totalMatched={total}
      limit={limit}
    />
  )
}
