# Fluxzero Agent Plugins

This repository distributes Fluxzero plugins for Codex, Claude Code, Cursor,
and GitHub Copilot, plus the equivalent Gemini CLI extension. Every package
contains the same application-building skill and configures the production
Fluxzero MCP documentation server and automated local-development server.
Install the package for your coding agent once; projects do not need local
Fluxzero manuals or duplicate MCP registrations.

Every package provides the same workflow:

- use the Fluxzero CLI and a Java or Kotlin starter for a new, empty project
- preserve the build and layout of an existing project
- compare its SDK with the version advertised by the MCP documentation
- retrieve focused framework guidance instead of reading the whole graph
- let one Fluxzero dev environment watch, compile, run, and test the project
- follow cursored structured feedback to the relevant terminal state after each
  coherent edit
- implement and test a real Fluxzero application rather than a generic service

The two servers have deliberately separate names and responsibilities:

- `fluxzero-docs` serves stable framework guidance over HTTP.
- `fluxzero-dev` runs `fz mcp --ensure-dev` in the current project. It reuses or
  starts one background environment and returns current problems, bounded logs,
  test status, and a cursored development event stream.

When `fluxzero-dev` is active, agents must not run duplicate wrapper tests,
applications, watchers, or continuous log commands. Project wrappers remain
available for CI, releases, and explicit fallback verification.

## Install

### Codex

```bash
codex plugin marketplace add fluxzero-io/fluxzero-agent-plugins
codex plugin add fluxzero@fluxzero
```

Start a new Codex task after installation or update.

### Claude Code

```bash
claude plugin marketplace add fluxzero-io/fluxzero-agent-plugins
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
gemini extensions install https://github.com/fluxzero-io/fluxzero-agent-plugins --consent
```

Restart Gemini CLI after installation or update.

### GitHub Copilot CLI

```bash
copilot plugin marketplace add fluxzero-io/fluxzero-agent-plugins
copilot plugin install fluxzero@fluxzero
```

Start a new Copilot CLI session after installation or update. The same plugin
components are also available to Copilot app clients that use CLI plugins.

### Let the coding agent install its Fluxzero package

This minimal prompt is intentionally agent-neutral:

```text
I want to build an application using Fluxzero. Ensure the Fluxzero plugin from https://github.com/fluxzero-io/fluxzero-agent-plugins is installed and available, then let me know when you are ready for my application requirements.
```

Gemini CLI calls this package an extension. Its dedicated instructions and
commands below use that native terminology.

## Generated project instructions

The files in `project-instructions/` are the source for new Fluxzero projects:

- `AGENTS.md` contains the short, agent-neutral invariant used by Codex,
  Cursor, and GitHub Copilot.
- `CLAUDE.md` imports `AGENTS.md` and adds only the Claude installation and
  reload command.
- `GEMINI.md` imports `AGENTS.md` and adds only the Gemini installation and
  restart command.

This avoids maintaining full, divergent manuals per agent while respecting
their different instruction-file discovery rules. An unavailable plugin or
extension is a bootstrap boundary, not permission to implement from stale local
docs.

## Repository layout

`skills/build-fluxzero-app/SKILL.md` is the canonical skill and the Gemini CLI
copy. `npm run generate` renders byte-identical skill copies into four thin,
self-contained plugin packages, plus their manifests, transport-specific
documentation and development MCP configurations, and marketplace catalogs.
The internal `adapters/` directories keep agent-specific formats isolated so
one client cannot auto-discover another client's incompatible MCP settings. CI
rejects generated drift and symlinks.

## Development

```bash
npm run generate
npm test
```

The generators have no third-party runtime dependencies. Validate agent-native
install flows in isolated home directories before publishing a release.

## Releases

`plugins.config.json` is the source of the plugin version rendered into every
agent package. Keep the matching `package.json` version in sync, run
`npm run generate`, and merge the version change into `main`. After validation
succeeds, CI creates the corresponding `v<version>` tag and GitHub release.
Subsequent pushes with the same version leave the existing release unchanged.

## License

Licensed under the Apache License 2.0. See [LICENSE](LICENSE).
