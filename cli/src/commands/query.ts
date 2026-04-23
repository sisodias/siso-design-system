import { BASE_URL } from '../config.js'

export async function commandQuery(queryText: string, opts: { limit?: string; category?: string }): Promise<void> {
  const body: Record<string, unknown> = { query: queryText, limit: parseInt(opts.limit ?? '10', 10) }
  if (opts.category) body.categories = [opts.category]
  const res = await fetch(BASE_URL + '/api/query', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) { console.error('Query failed:', res.status, await res.text()); process.exit(1) }
  process.stdout.write(JSON.stringify(await res.json(), null, 2) + '\n')
}
