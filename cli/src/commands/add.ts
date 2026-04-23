import { BASE_URL } from '../config.js'
import { spawnSync } from 'child_process'

export function commandAdd(sourceSlug: string): void {
  const [source, ...rest] = sourceSlug.split('/')
  const slug = rest.join('/')
  if (!source || !slug) { console.error('Usage: siso add <source>/<slug>'); process.exit(1) }
  const registryUrl = BASE_URL + '/r/' + source + '/' + slug + '.json'
  console.error('Installing: ' + registryUrl)
  const result = spawnSync('npx', ['shadcn@latest', 'add', registryUrl], { stdio: 'inherit', shell: true })
  process.exit(result.status ?? 1)
}
