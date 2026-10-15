@./AGENTS.md

## Gemini CLI bootstrap

If the Fluxzero extension is unavailable, run this from a terminal outside the current interactive session:

```bash
gemini extensions install https://github.com/fluxzero-io/fluxzero-agent-plugins --consent --auto-update
```

Verify that extension automatic updates are enabled. For an existing installation,
follow `https://plugins.fluxzero.io#gemini-cli` to enable them through the installed
client's supported settings, preserving explicit opt-outs and pins. If unavailable,
occasionally run `gemini extensions update fluxzero` when starting a new project
or returning after several days; do not reinstall just to change this preference.

Before restarting, complete the Git, Fluxzero CLI, and Java readiness checks in
`AGENTS.md`. Then restart Gemini CLI once and verify Fluxzero documentation and status tools
before continuing.
