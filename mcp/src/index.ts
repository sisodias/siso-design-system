import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { toolQuery } from './tools/query.js'
import { toolList } from './tools/list.js'
import { toolFacets } from './tools/facets.js'
import { toolAdd } from './tools/add.js'
import { toolPick } from './tools/pick.js'

const BASE_URL = process.env.SISO_BASE_URL ?? 'https://siso-design-system.vercel.app'

const server = new McpServer({ name: '@siso-ui/mcp-server', version: '0.1.0' })

server.tool(
  'siso_query',
  'Search the SISO component bank by facets + text query. Returns ranked components with ai_summary, thumbnails, and install URLs. Use this FIRST to find candidates before asking the user to pick.',
  {
    query: z.string().optional().describe('Free-text search (e.g. "dark pricing card with glow")'),
    categories: z.array(z.string()).optional().describe('e.g. ["pricing", "hero", "card"]'),
    visualStyles: z.array(z.string()).optional().describe('e.g. ["dark", "glassmorphism"]'),
    industries: z.array(z.string()).optional().describe('e.g. ["saas", "fintech"]'),
    complexity: z.array(z.enum(['atomic', 'composite', 'system'])).optional(),
    limit: z.number().optional().default(10),
    mode: z.enum(['strict', 'loose']).optional().default('strict'),
  },
  async (args) => toolQuery({ baseUrl: BASE_URL, ...args })
)

server.tool(
  'siso_pick',
  'Open the visual picker in the user\'s browser. User sees a grid of matching components and clicks one. Returns the picked component(s) as JSON. USE THIS WHEN: query returned multiple good candidates and the user needs to choose visually.',
  {
    category: z.string().optional(),
    query: z.string().optional(),
    limit: z.number().optional().default(12),
    mode: z.enum(['single', 'multi']).optional().default('single'),
    timeoutSec: z.number().optional().default(300),
  },
  async (args) => toolPick({ baseUrl: BASE_URL, ...args })
)

server.tool(
  'siso_add',
  'Install a component into the current project via `npx shadcn@latest add <url>`. Call this AFTER user has picked a component (either via siso_pick or from siso_query results).',
  {
    source: z.string().describe('Component source namespace, e.g. "21st-dev"'),
    slug: z.string().describe('Component slug within source'),
  },
  async (args) => toolAdd({ baseUrl: BASE_URL, ...args })
)

server.tool(
  'siso_list',
  'Return manifest metadata (total components, sources, classified counts). Use to understand what\'s available in the bank.',
  {},
  async () => toolList({ baseUrl: BASE_URL })
)

server.tool(
  'siso_facets',
  'Return the current facet vocabulary (all categories, visualStyles, industries, complexity values). Use BEFORE siso_query to know what facet values are valid.',
  {},
  async () => toolFacets({ baseUrl: BASE_URL })
)

await server.connect(new StdioServerTransport())
