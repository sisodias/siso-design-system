import { spawnSync } from 'child_process'

export async function toolAdd(args: { baseUrl: string; source: string; slug: string }) {
  const url = `${args.baseUrl}/r/${args.source}/${args.slug}.json`
  const result = spawnSync('npx', ['shadcn@latest', 'add', url], {
    encoding: 'utf-8',
    shell: true,
  })
  const text = [
    `Running: npx shadcn@latest add ${url}`,
    result.stdout ?? '',
    result.stderr ?? '',
    `Exit code: ${result.status ?? 1}`,
  ]
    .filter(Boolean)
    .join('\n')
  return {
    content: [{ type: 'text' as const, text }],
    isError: (result.status ?? 1) !== 0,
  }
}
