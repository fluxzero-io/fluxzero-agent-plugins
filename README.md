# Fluxzero Agent Integrations

This repository distributes one Fluxzero application-building skill and the
production Fluxzero MCP documentation server to Codex, Claude Code, Cursor,
Gemini CLI, and GitHub Copilot. Install the adapter for your coding agent once;
projects do not need local Fluxzero manuals or a duplicate MCP registration.

Every adapter provides the same workflow:

- use the Fluxzero CLI and a Java or Kotlin starter for a new, empty project
- preserve the build and layout of an existing project
- compare its SDK with the version advertised by the MCP documentation
- retrieve focused framework guidance instead of reading the whole graph
- implement and test a real Fluxzero application rather than a generic service

## Install

### Codex

```bash
codex plugin marketplace add fluxzero-io/fluxzero-agent-integrations
codex plugin add fluxzero@fluxzero
```

Start a new Codex task after installation or update.

### Claude Code

```bash
claude plugin marketplace add fluxzero-io/fluxzero-agent-integrations
claude plugin install fluxzero@fluxzero
```

Run `/reload-plugins` or start a new Claude Code session.

### Cursor

The repository contains a Cursor marketplace and plugin manifest ready for
Cursor Marketplace publication. Once listed, install it in Cursor with:

```text
/add-plugin fluxzero
```

For local verification before marketplace approval, copy
`adapters/cursor/fluxzero` to `~/.cursor/plugins/local/fluxzero` and reload
Cursor.

### Gemini CLI

```bash
gemini extensions install https://github.com/fluxzero-io/fluxzero-agent-integrations --consent
```

Restart Gemini CLI after installation or update.

### GitHub Copilot CLI

```bash
copilot plugin marketplace add fluxzero-io/fluxzero-agent-integrations
copilot plugin install fluxzero@fluxzero
```

Start a new Copilot CLI session after installation or update. The same plugin
components are also available to Copilot app clients that use CLI plugins.

### Let the current coding agent install its adapter

This minimal prompt is intentionally agent-neutral:

```text
Install the Fluxzero integration for the coding agent you are running from the repository fluxzero-io/fluxzero-agent-integrations. Then stop and tell me how to reload or restart so the integration is available.
```

Installation modifies agent-level configuration. A coding task should resume
only after the agent has reloaded the new skill and MCP server.

## Generated project instructions

The files in `project-instructions/` are the source for new Fluxzero projects:

- `AGENTS.md` contains the short, agent-neutral invariant used by Codex,
  Cursor, and GitHub Copilot.
- `CLAUDE.md` imports `AGENTS.md` and adds only the Claude installation and
  reload command.
- `GEMINI.md` imports `AGENTS.md` and adds only the Gemini installation and
  restart command.

This avoids maintaining full, divergent manuals per agent while respecting
their different instruction-file discovery rules. An unavailable integration
is a bootstrap boundary, not permission to implement from stale local docs.

## Repository layout

`skills/build-fluxzero-app/SKILL.md` is the canonical skill and the Gemini CLI
copy. `npm run generate` renders byte-identical skill copies into four thin,
self-contained adapters, plus their manifests, transport-specific MCP
configurations, and marketplace catalogs. Keeping the adapter directories
separate prevents one agent from auto-discovering another agent's incompatible
MCP settings. CI rejects generated drift and symlinks.

## Development

```bash
npm run generate
npm test
```

The generators have no third-party runtime dependencies. Validate agent-native
install flows in isolated home directories before publishing a release.

## License

Licensed under the Apache License 2.0. See [LICENSE](LICENSE).
