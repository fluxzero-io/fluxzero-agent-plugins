# Fluxzero Codex Plugin

This repository contains an installable Codex plugin that helps users build Fluxzero
applications from product briefs.

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

For local development, replace the marketplace source with `.`. The marketplace
name remains `fluxzero`, so a project should not bundle another copy of the
plugin or register the same MCP server separately.

Start a new Codex thread after installing or updating the plugin so Codex loads
the latest skill and MCP configuration.
