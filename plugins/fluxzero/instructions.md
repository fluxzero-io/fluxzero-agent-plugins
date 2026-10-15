## Codex plugin updates

Codex refreshes configured Git marketplaces in the background when its own
app server starts. This is unrelated to the Fluxzero Dev Server, and opening
a new chat need not restart it. Rely on this built-in behavior; no extra setting
or startup hook is needed. Preserve the marketplace source, ref and managed
policies. Only if Codex stays open for several days, run
`codex plugin marketplace upgrade fluxzero` once and verify the installed version
with `codex plugin list --marketplace fluxzero --json`. Defer while offline and
retain the working installation. Do not check per prompt or per new project
in a recently started app. Report automatic updates at Codex startup, with an
occasional manual check during prolonged uptime. Follow activation below.

## Codex activation

After installation or upgrade, keep the current conversation, directory and
checkout. Recent Codex versions pick up installed plugin tools in existing
sessions and refresh skills after plugin changes. Do not create a fork or a
new task solely to activate Fluxzero. If the current turn still has the old
skill catalogue, continue verification on the next user message in this task.

Confirm that the skill is available and complete `docs_start` and `get_status`
through `fluxzero` before application work. If activation is still missing,
inspect the client version and MCP startup diagnostics and use its supported
reload mechanism. Relaunch the process only when needed, for example when its
inherited `PATH` cannot resolve `fz`; preserve the conversation and setup.
Do not reinstall a working plugin or bypass missing MCP tools.
