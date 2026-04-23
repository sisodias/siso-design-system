import { spawnSync } from 'child_process'

export async function toolPick(args: {
  baseUrl: string
  category?: string
  query?: string
  limit?: number
  mode?: 'single' | 'multi'
  timeoutSec?: number
}) {
  const cliArgs: string[] = ['@siso-ui/cli', 'pick']
  if (args.category) cliArgs.push(args.category)
  if (args.query) cliArgs.push('--q', args.query)
  if (args.limit) cliArgs.push('--limit', String(args.limit))
  if (args.mode) cliArgs.push('--mode', args.mode)

  const result = spawnSync('npx', cliArgs, {
    encoding: 'utf-8',
    shell: true,
    env: {
      ...process.env,
      SISO_BASE_URL: args.baseUrl,
      SISO_PICK_TIMEOUT: String((args.timeoutSec ?? 300) * 1000),
    },
    timeout: (args.timeoutSec ?? 300) * 1000 + 5000,
  })

  if ((result.status ?? 1) !== 0) {
    return {
      content: [
        { type: 'text' as const, text: `Pick failed or cancelled:\n${result.stderr ?? ''}` },
      ],
      isError: true,
    }
  }

  // CLI prints JSON to stdout on success
  return {
    content: [{ type: 'text' as const, text: result.stdout.trim() }],
  }
}
