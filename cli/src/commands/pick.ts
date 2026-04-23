import { BASE_URL, PICK_TIMEOUT_MS, PREFERRED_PORT } from '../config.js'
import { openBrowser } from '../browser.js'
import { findFreePort, startCallbackServer } from '../local-server.js'
import chalk from 'chalk'

export async function commandPick(categoryArg: string | undefined, opts: { limit?: string; q?: string; style?: string; mode?: string }): Promise<void> {
  const session = crypto.randomUUID()
  const port = await findFreePort(PREFERRED_PORT)
  const server = await startCallbackServer(port, PICK_TIMEOUT_MS)
  const callbackUrl = server.url + '/picked'

  const params = new URLSearchParams()
  if (categoryArg) params.set('category', categoryArg)
  if (opts.q) params.set('q', opts.q)
  if (opts.style) params.set('style', opts.style)
  params.set('mode', opts.mode ?? 'single')
  params.set('callbackMode', 'redirect')
  params.set('callbackUrl', callbackUrl)
  params.set('session', session)
  params.set('limit', String(Math.min(parseInt(opts.limit ?? '12', 10), 100)))

  const pickerUrl = BASE_URL + '/pick?' + params.toString()
  console.error(chalk.dim('Opening picker: ' + pickerUrl))

  await openBrowser(pickerUrl)
  const result = await server.waitForCallback()

  if (result.type === 'cancelled') {
    console.error(chalk.yellow('Pick cancelled.'))
    process.exit(1)
  }
  process.stdout.write(JSON.stringify(result.payload, null, 2) + '\n')
  process.exit(0)
}
