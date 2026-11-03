# Fluxzero Agent Instructions

The plugin MCP connection is named `fluxzero` (Fluxzero). Older plugin versions, project instructions and server workflows may call it `fluxzero-dev`; this is the same integration. Use the available Fluxzero connection and its advertised tools, and never register a second connection just to provide the old name.

Use the installed Fluxzero plugin for all Fluxzero application work in this project. Retrieve current SDK guidance through `fluxzero`, use `fluxzero` as the exclusive owner of source watching, compilation, application processes, test selection, and test execution, and follow the `build-fluxzero-app` skill. Observe its structured results; do not manually rerun selected tests, existing regression tests, or the full suite after edits, and do not start duplicate builds, tests, applications, watchers, or log followers while that development environment is active. CI owns full regression coverage. A healthy compile/reload is sufficient when the Dev Server selects no tests. Make a new or changed test pass once through the managed loop, then let impact selection decide when it runs again. Only when verification is explicitly unmanaged may the agent run that new or changed focused test once itself. Keep one writer per feature slice; parallel agents must not edit the same files from stale snapshots.

Treat environment readiness as a hard gate before application work. Require working `git --version`, `fz version`, `fz mcp --help`, and `fz init --help` with `--in-place`; let the Fluxzero CLI own Java 25 detection. If Fluxzero reports that Java 25 is needed and the current execution environment permits software installation, install it yourself without asking the user, using `brew install openjdk@25` on macOS or Linux with Homebrew, or `winget install --exact --id EclipseAdoptium.Temurin.25.JDK --accept-package-agreements --accept-source-agreements --disable-interactivity` on Windows, then retry the original Fluxzero command. Treat existing agent execution permission as authorization. Only if the environment requires separate user approval, ask "Fluxzero needs Java 25. May I install it?" and continue after approval. Never ask the user to run commands, expose package, path, runtime, JDK, or environment-variable details in the permission question, or bypass denied permission. On macOS, inspect Apple Command Line Tools with `xcode-select -p` and `pkgutil --pkg-info com.apple.pkg.CLTools_Executables` before invoking Git. When both are absent, explain that this first Fluxzero build needs a one-time tool setup for fast, reliable builds and tests; run `xcode-select --install` exactly once, tell the user to finish Apple's dialog, and stop. Resume the same bootstrap after the user returns. Never bypass missing Git with a branch ZIP or mutable source archive, and never claim readiness based only on a successful plugin command.

The `fluxzero` MCP server requires the Fluxzero CLI on the coding-agent process's `PATH`. If `fz` is unavailable, install it with `brew install fluxzero-io/tap/fluxzero` on macOS or Linux with Homebrew, `winget install --exact --id Fluxzero.FluxzeroCLI` on Windows, or `curl -sSL https://github.com/fluxzero-io/fluxzero-cli/releases/latest/download/install.sh | sh -s -- --install-path` on Linux or another supported Unix environment. On a bare Mac, finish Command Line Tools first, follow the current Homebrew instructions at `https://brew.sh`, and apply its printed shell setup; do not use the Unix fallback as the macOS route. Verify the CLI from a clean login shell and ensure GUI-launched agents inherit its directory. If this requires a native reload or restart, tell the user the one exact action and stop until it is complete.

Use the effective Maven or Gradle model for the project SDK version. Retrieve documentation with the `docs_*` tools on `fluxzero`; they select an explicit version, the detected project version, or the latest release before a project exists. Preserve returned `namespace` and `version` when reading and following links. A mismatch is not a reason to upgrade or downgrade the project. Missing matching documentation is a visible limitation, not permission to switch SDK versions. Existing `.fluxzero/agents` manuals are legacy files; prefer selective MCP retrieval. Only when manuals are insufficient, inspect `https://github.com/fluxzero-io/fluxzero-sdk-java` at the matching release tag, never `main`.

The plugin starts `fz mcp` without starting project processes. `dev-server-not-running` is a valid documentation bootstrap status. When project development is needed, call the `start_dev` MCP tool with no arguments on the same connection. Require this tool after activation. Poll `get_status` while `dev-server-starting`; if startup fails, inspect diagnostics, correct the cause and retry `start_dev`. Status and documentation calls never start development themselves. The dev server retains its project/empty-workspace checks. Once active, obtain a fresh status cursor and follow the managed development loop.

The installed CLI is authoritative for its evolving capabilities and for the dev-server version selected by this project. Use `fz --help` for the current CLI surface, `fz dev --help` for current development actions and options, and `fz dev config` before creating or editing `.fluxzero/dev.yaml`. Inspect existing configuration first. Do not infer flags, YAML keys, defaults, or precedence from these instructions, memory, another project, or a copied example; command output wins when guidance differs.

If the skill or `fluxzero` server is unavailable, follow the complete onboarding at `https://plugins.fluxzero.io` (source repository `fluxzero-io/fluxzero-agent-plugins`) using this coding agent's native plugin mechanism. Complete prerequisites, then follow the current agent's activation instructions in that onboarding guide. Preserve the directory, checkout, and user's request; a stale inherited `PATH` requires a full process relaunch. After activation, require the skill, complete `docs_start`, and complete a `get_status` call through `fluxzero`; configuration or tool registration alone is not readiness. The status call must work in an empty workspace and identify its intended root. Initialize such a root with `fz init --in-place`. If no dev server is active, call `start_dev` on the same MCP connection, poll `get_status` while startup is in progress and obtain a fresh cursor. If a greenfield environment was already active, retain its pre-init cursor and the same dev session. If the installed package remains unavailable and the agent cannot perform the required activation, tell the user which one agent-native action is required and stop before changing Fluxzero code. Do not substitute direct wrapper builds or a separately started dev server for a missing plugin MCP surface.

Use the versioned graph through the local plugin/MCP as the managed documentation source. Do not add hand-maintained Fluxzero manuals or duplicate the Fluxzero MCP configuration in this project.

During onboarding, follow `https://plugins.fluxzero.io#install` to enable native automatic plugin updates for Fluxzero where supported and verify the saved preference when one exists; otherwise follow the client’s built-in update behavior. Preserve explicit update opt-outs, pins and managed policies. When automatic updates are unavailable, check once when starting a new project or returning after several days; do not check every prompt, interrupt active work or add scheduled jobs. For Codex, rely on automatic Git-marketplace refresh at Codex app-server startup (not Fluxzero Dev Server startup); only add a manual check if the Codex app stays open for several days. Defer checks while offline and give one brief update-status line at onboarding completion.

During onboarding, inspect `fz upgrade --help`; when `--auto-update` is supported, run `fz upgrade --auto-update enable-if-unset` and verify with `fz upgrade --auto-update status`. This enables background CLI checks at most once every three days for stable releases within the current major. Preserve explicit opt-outs, package-manager pins and managed policies. If an older CLI lacks the option, report the limitation briefly and continue supported work; do not retry every prompt. Keep CLI and plugin preferences separate, and do not upgrade project SDK dependencies or restart running environments for this setup.

## Reporting Fluxzero product issues

When evidence points to a Fluxzero product defect or missing capability rather
than an application-specific bug, tell the user and offer to report it in the
owning repository:

- SDK: `https://github.com/fluxzero-io/fluxzero-sdk-java`
- CLI: `https://github.com/fluxzero-io/fluxzero-cli`
- Agent plugin: `https://github.com/fluxzero-io/fluxzero-agent-plugins`
- Dev Server and Devboard: `https://github.com/fluxzero-io/fluxzero-dev-server`

First consult the version-matched documentation, installed command help and
relevant workflow, and rule out application configuration, usage, and a known
version mismatch. Record the affected component version without changing the
project, check whether the current release already fixes or documents the
behavior, and search open and closed issues. Treat external search queries as
disclosures: use only sanitized Fluxzero component terms, versions, and generic
error identifiers, never project-derived text. If an existing issue covers it,
do not create a duplicate; offer its link or a sanitized comment draft instead.
If ownership is unclear, show the possible repositories and do not cross-post.

Only offer to post directly when an already authenticated GitHub route is
available, such as `gh` with valid authentication or an authenticated GitHub
connector or browser session. Verify access without starting a new login solely
to report an issue, and identify the active GitHub account. Prepare a concise
title and body. Show the exact sanitized draft, target repository, publishing
account, and public visibility to the user, and obtain explicit permission
before any public write, including a comment. General permission to work on the
project is not permission to publish. If permission is declined, do not publish
or ask again unless the user reopens the topic. Without an authenticated route,
give the user the draft and continue the requested work without blocking on it.

Treat the issue and its draft as public. Use generic placeholders and the
smallest synthetic reproduction. Include only relevant Fluxzero component
versions, platform details, sanitized reproduction steps, expected versus
actual behavior, and a manually rewritten, minimal error excerpt when essential.
Never paste project or repository names, private source code or configuration,
raw logs, stack traces, traces, payloads, local paths, environment values,
identifiers, URLs, branch names, user or customer data, business details,
credentials, or secrets from the project. If an actionable report cannot be
written without such context, do not publish it; explain the limit and leave a
private sanitized draft for the user.

Never disclose a suspected vulnerability, credential exposure, or privacy or
security incident in a public issue or comment. Read the owning repository's
`SECURITY.md` and use its private reporting route. Show the sanitized private
report and obtain explicit permission before submitting it. Apply the same
project-context exclusions and data minimization to private reports; never
include production secrets or customer data.

## Functional progress

Follow the plugin's Functional Progress workflow to keep `.fluxzero/progress.yaml`
current through `get_progress` and the `upsert_progress_*` MCP tools. Record only
agreed functional features and user-reported bugs, grouped into milestones, with
Planned, In progress or Done. Preserve history and verify acceptance before Done.
This overview supports the conversation; implementation chores do not belong in it.

## Application monitoring

Follow the plugin's Investigating Application Behavior workflow when Devboard
monitoring MCP tools are available. Inspect issues, traces, audit messages,
application logs and relevant stored documents directly for the selected project.
Use bounded summaries before requesting payloads; report unavailable or truncated
data honestly. Monitoring does not replace managed build/test feedback and is not
a reason to reset the workspace or ask the user to gather logs manually.

Resolve the corresponding issue after an authorized fix is verified, and explain
why in the conversation. Reopen if the problem persists. Mute/unmute only at the
user's explicit request. Read the issue first and recheck after an unconfirmed
write instead of blindly repeating an action.
