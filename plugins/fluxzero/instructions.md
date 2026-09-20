## Codex activation

After installation or upgrade, keep the current conversation, directory and
checkout. Recent Codex versions pick up installed plugin tools in existing
sessions and refresh skills after plugin changes. Do not create a fork or a
new task solely to activate Fluxzero. If the current turn still has the old
skill catalogue, continue verification on the next user message in this task.

Confirm that the skill is available and complete `docs_start` and `get_status`
through `fluxzero-dev` before application work. If activation is still missing,
inspect the client version and MCP startup diagnostics and use its supported
reload mechanism. Relaunch the process only when needed, for example when its
inherited `PATH` cannot resolve `fz`; preserve the conversation and setup.
Do not reinstall a working plugin or bypass missing MCP tools.
