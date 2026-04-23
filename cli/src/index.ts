import { Command } from 'commander'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { commandPick } from './commands/pick.js'
import { commandAdd } from './commands/add.js'
import { commandQuery } from './commands/query.js'
import { commandList } from './commands/list.js'
import { commandFacets } from './commands/facets.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'))

const program = new Command()
program.name('siso').description('SISO Design System CLI').version(pkg.version)

program.command('pick [category]').description('Open visual picker, print JSON to stdout')
  .option('--limit <n>', 'Max cards', '12')
  .option('--q <query>', 'Free-text filter')
  .option('--style <style>', 'Visual style filter')
  .option('--mode <mode>', 'single or multi', 'single')
  .action((cat, opts) => commandPick(cat, opts))

program.command('add <source/slug>').description('Install component via npx shadcn add')
  .action((s) => commandAdd(s))

program.command('query <text>').description('Search components, print ranked results')
  .option('--limit <n>', 'Max results', '10')
  .option('--category <cat>', 'Category filter')
  .action((text, opts) => commandQuery(text, opts))

program.command('list').description('Print manifest metadata').action(() => commandList())
program.command('facets').description('Print facet vocabulary').action(() => commandFacets())

program.parseAsync(process.argv)
