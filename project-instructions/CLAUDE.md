@AGENTS.md

## Claude Code bootstrap

If the Fluxzero plugin is unavailable, run:

```bash
claude plugin marketplace add fluxzero-io/fluxzero-agent-plugins
claude plugin install fluxzero@fluxzero
```

Enable automatic updates for the `fluxzero` marketplace as part of onboarding:
set `extraKnownMarketplaces.fluxzero.autoUpdate` to `true` in the active user
settings, preserving the source and other fields, or use `/plugin` →
**Marketplaces** → **fluxzero** → **Enable auto-update**. Verify the effective
preference; preserve explicit opt-outs, pins and managed policies. Follow
`https://plugins.fluxzero.io#install` for details and the occasional-check fallback.

Before reloading, complete the Git, Fluxzero CLI, and Java readiness checks in
`AGENTS.md`. Recent versions apply `/plugin` menu installations when it closes.
For CLI installations or pending changes, run `/reload-plugins` in the current
session. Verify Fluxzero documentation and status tools before continuing; a new
session is not required solely because the plugin was installed.
