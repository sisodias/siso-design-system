export async function toolQuery(args: {
  baseUrl: string
  query?: string
  categories?: string[]
  visualStyles?: string[]
  industries?: string[]
  complexity?: string[]
  limit?: number
  mode?: 'strict' | 'loose'
}) {
  const { baseUrl, ...body } = args
  const res = await fetch(`${baseUrl}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    return {
      content: [{ type: 'text' as const, text: `Query failed: ${res.status} ${await res.text()}` }],
      isError: true,
    }
  }
  const data = await res.json()
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] }
}
