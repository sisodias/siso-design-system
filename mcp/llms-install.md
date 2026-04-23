# @siso-ui/mcp-server install

To install the SISO Design System MCP server for the user:

1. Run: `claude mcp add siso-ui npx -y @siso-ui/mcp-server`
2. Or add to `claude_desktop_config.json`:
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
3. Restart the MCP client.

Tools exposed: siso_query, siso_pick, siso_add, siso_list, siso_facets.
