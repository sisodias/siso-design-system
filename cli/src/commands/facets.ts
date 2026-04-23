import { BASE_URL } from '../config.js'

export async function commandFacets(): Promise<void> {
  const res = await fetch(BASE_URL + '/api/facets')
  if (!res.ok) { console.error('Facets failed:', res.status); process.exit(1) }
  process.stdout.write(JSON.stringify(await res.json(), null, 2) + '\n')
}
