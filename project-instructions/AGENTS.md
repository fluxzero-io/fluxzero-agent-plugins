# Fluxzero Agent Instructions

Use the installed Fluxzero plugin for all Fluxzero application work in this project. Retrieve current SDK guidance through `fluxzero-docs`, use `fluxzero-dev` as the owner of the local build/test/application loop, and follow the `build-fluxzero-app` skill. Do not run duplicate builds, tests, applications, watchers, or log followers while that development environment is active.

The `fluxzero-dev` MCP server requires the Fluxzero CLI on `PATH`. Run `fz version` before application work. If `fz` is unavailable, install it with `brew install fluxzero-io/tap/fluxzero` on macOS, `winget install --exact --id Fluxzero.FluxzeroCLI` on Windows, or `curl -sSL https://github.com/fluxzero-io/fluxzero-cli/releases/latest/download/install.sh | sh -s -- --install-path` on Linux or another supported Unix environment. Run `fz version` again afterward and start a new terminal or coding-agent session if the current process does not see the updated `PATH`.

If the skill or `fluxzero-docs` server is unavailable, install the Fluxzero plugin from `fluxzero-io/fluxzero-agent-plugins` using this coding agent's native plugin mechanism. Gemini CLI calls plugins extensions. If the installed package is not available in the current session, tell the user which agent-native action is required and stop before changing Fluxzero code.

Use the plugin as the single documentation source; do not add repository-local Fluxzero manuals or duplicate either Fluxzero MCP configuration in this project.
