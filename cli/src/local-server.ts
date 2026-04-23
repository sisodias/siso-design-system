import http from 'http'
import net from 'net'

export async function findFreePort(preferred: number): Promise<number> {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.listen(preferred, '127.0.0.1', () => {
      const address = server.address()
      if (address && typeof address === 'object' && 'port' in address) {
        server.close(() => resolve(address.port))
      } else {
        server.close(() => resolve(preferred))
      }
    })
    server.on('error', () => {
      const fallback = net.createServer()
      fallback.listen(0, '127.0.0.1', () => {
        const address = fallback.address()
        if (address && typeof address === 'object' && 'port' in address) {
          fallback.close(() => resolve(address.port))
        } else {
          fallback.close(() => resolve(0))
        }
      })
    })
  })
}

export type CallbackResult = { type: 'picked'; payload: object } | { type: 'cancelled' }

export async function startCallbackServer(port: number, timeoutMs: number): Promise<{
  url: string
  waitForCallback: () => Promise<CallbackResult>
}> {
  let resolveWait: (result: CallbackResult) => void
  const waitPromise = new Promise<CallbackResult>((resolve) => { resolveWait = resolve })

  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '', `http://127.0.0.1:${port}`)
    res.setHeader('Content-Type', 'text/html')

    if (url.pathname === '/picked') {
      try {
        const sisoPicked = url.searchParams.get('siso_picked') ?? ''
        const payload = JSON.parse(Buffer.from(sisoPicked, 'base64url').toString('utf-8'))
        res.writeHead(200)
        res.end('<html><body><script>window.close()</script><p>Selection received. You can close this tab.</p></body></html>')
        resolveWait!({ type: 'picked', payload })
      } catch {
        res.writeHead(400)
        res.end('bad request')
      }
    } else if (url.pathname === '/cancelled') {
      res.writeHead(200)
      res.end('<html><body><p>Pick cancelled.</p></body></html>')
      resolveWait!({ type: 'cancelled' })
    } else {
      res.writeHead(404)
      res.end('not found')
    }
  })

  await new Promise<void>((resolve, reject) => {
    server.on('error', reject)
    server.listen(port, '127.0.0.1', resolve)
  })

  const timeoutHandle = setTimeout(() => {
    resolveWait!({ type: 'cancelled' })
  }, timeoutMs)

  return {
    url: `http://127.0.0.1:${port}`,
    waitForCallback: () => waitPromise.finally(() => clearTimeout(timeoutHandle)),
  }
}
