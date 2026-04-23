import open from 'open'
const ALLOWED_SCHEMES = ['http:', 'https:']
export async function openBrowser(url: string): Promise<void> {
  try {
    const parsed = new URL(url)
    if (!ALLOWED_SCHEMES.includes(parsed.protocol)) throw new Error(`Unsafe URL scheme: ${parsed.protocol}`)
  } catch { throw new Error(`Invalid URL: ${url}`) }
  await open(url)
}
