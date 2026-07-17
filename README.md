# Fluxzero Codex Plugin

This repository contains the installable Codex plugin for building and extending
Fluxzero applications. Installing it once gives Codex both the application-building
workflow and the current Fluxzero MCP documentation; projects do not need local
Fluxzero agent manuals or their own MCP registration.

The plugin bundles:

- a `build-fluxzero-app` skill that makes Fluxzero the required application
  architecture for greenfield app-building tasks
- a Fluxzero MCP server configuration so Codex can retrieve current guidance
- a repo-local plugin marketplace at `.agents/plugins/marketplace.json`

## Install

Add this repository as a marketplace and install the plugin:

```bash
codex plugin marketplace add fluxzero-io/fluxzero-codex-plugin
codex plugin add fluxzero@fluxzero
```

Both commands are safe to repeat. Start a new Codex task after installing or
updating so that task loads the plugin's skill and MCP tools.

### Let a coding agent install it

Give a Codex agent these lines:

```text
Install the Fluxzero Codex plugin by running:
codex plugin marketplace add fluxzero-io/fluxzero-codex-plugin
codex plugin add fluxzero@fluxzero
Then stop and tell me to start a new Codex task so the plugin is loaded.
```

The new task can contain only the product request. For a new project, Codex will
install the Fluxzero CLI when necessary, generate the selected Java or Kotlin
starter in an empty target, and adapt it to the request. For an existing project,
open that repository and ask for the change: the plugin preserves its build and
layout, reads its Fluxzero version, and does not scaffold over it.

## Update

Refresh the marketplace snapshot, reinstall the current plugin bundle, and then
start a new task:

```bash
codex plugin marketplace upgrade fluxzero
codex plugin add fluxzero@fluxzero
```

For local development, replace the marketplace source with `.`. The marketplace
name remains `fluxzero`, so a project should not bundle another copy of the
plugin or register the same MCP server separately. Local manuals are deliberately
not part of the setup.

## Development verification

Validate the manifest and skill with the official Codex plugin and skill
validators, then test the marketplace install in an isolated `CODEX_HOME`. The
plugin must remain self-contained: one skill, one MCP configuration, and no
project-local installation side effects.

## License

Licensed under the Apache License 2.0. See [LICENSE](LICENSE).
