import { BASE_URL } from '../config.js'

export async function commandList(): Promise<void> {
  const res = await fetch(BASE_URL + '/api/components/meta')
  if (!res.ok) { console.error('List failed:', res.status); process.exit(1) }
  process.stdout.write(JSON.stringify(await res.json(), null, 2) + '\n')
}
