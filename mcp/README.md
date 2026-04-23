# @siso-ui/mcp-server

Model Context Protocol server for the SISO Design System — let AI coding agents (Claude Code, Claude Desktop, Cursor, Windsurf) query and install UI components from a curated 3,500+ component bank.

## Install

Claude Code:
```bash
claude mcp add siso-ui npx -y @siso-ui/mcp-server
```

Claude Desktop / Cursor / Windsurf — manual config:
```json
{
  "mcpServers": {
    "siso-ui": {
      "command": "npx",
      "args": ["-y", "@siso-ui/mcp-server@latest"]
    }
  }
}
```

## Tools

- `siso_query(query, categories, visualStyles, industries, complexity, limit, mode)` — ranked search
- `siso_pick(category, query, limit, mode)` — opens visual picker in browser
- `siso_add(source, slug)` — install via `npx shadcn add`
- `siso_list()` — manifest metadata
- `siso_facets()` — current facet vocabulary

## Configuration

Set `SISO_BASE_URL` env var to override the default URL.
