# @siso/cli

Visual component picker for AI coding agents.

## Usage
  npx @siso/cli pick topbar --limit=10
  npx @siso/cli add 21st-dev/aliimam-gallery
  npx @siso/cli query "pricing card dark"
  npx @siso/cli list
  npx @siso/cli facets

## pick options
  --limit <n>   Max cards (default 12, max 100)
  --q <query>   Free-text pre-filter
  --style <s>   Visual style (e.g. dark, glassmorphism)
  --mode <m>    single (default) or multi

## Exit codes: 0=picked, 1=cancelled, 2=timeout
