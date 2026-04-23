export async function toolFacets(args: { baseUrl: string }) {
  const res = await fetch(`${args.baseUrl}/api/facets`)
  if (!res.ok) {
    return { content: [{ type: 'text' as const, text: `Failed: ${res.status}` }], isError: true }
  }
  return { content: [{ type: 'text' as const, text: JSON.stringify(await res.json(), null, 2) }] }
}
