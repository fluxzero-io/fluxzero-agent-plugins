<a href="https://fluxzero.io"><img src="https://raw.githubusercontent.com/fluxzero-io/.github/3fa8f79df95d07678a730147bc1bd0402ae660d5/assets/brand/2026-09/repository-header.svg" alt="Fluxzero — The European cloud for AI-built apps" width="1280"></a>

# Fluxzero Agent Plugins

Plugins for using [Fluxzero](https://fluxzero.io) with your coding agent.

[How it works](https://fluxzero.io/how-it-works) · [Docs](https://fluxzero.io/docs)

This repository distributes Fluxzero plugins for Codex, Claude Code, Cursor,
and GitHub Copilot, plus the equivalent Gemini CLI extension. Every package
contains the shared application-building workflow with an optional agent-specific activation supplement and configures one local MCP server for versioned documentation and development feedback.
Install the package for your coding agent once; projects do not need
hand-maintained Fluxzero manuals or duplicate MCP registrations.

## One-time environment onboarding

Treat first-time Fluxzero onboarding as one complete setup in the current
coding-agent task. Before asking for application requirements, prepare and
verify Git, the agent plugin, the Fluxzero CLI, and Java 25. If
tools are missing, explain once that this is the first Fluxzero build in the
environment and that the one-time setup enables fast, reliable builds and
tests. Do not present each prerequisite as an unrelated surprise.

Readiness is a verified state, not an inference from a successful plugin
command. Do not claim that the environment is ready while one of the checks
below is missing. In particular, do not bypass missing Git with a branch ZIP or
another mutable source and then treat Git as optional.

### Git on a bare macOS environment

The plugin commands below use Git. On macOS, inspect Apple Command Line Tools
without first invoking Apple's `/usr/bin/git` shim:

```bash
xcode-select -p
pkgutil --pkg-info com.apple.pkg.CLTools_Executables
```

If neither check finds a usable developer-tools installation, explain that
macOS will now open Apple's standard Command Line Tools installer. Run
`xcode-select --install` exactly once, tell the user to click **Install**, accept
the license, wait for completion, and return to this same task. Stop at that
boundary. Do not install the plugin, CLI, or Java while the dialog is open and do
not download an alternative plugin archive to avoid the Git prerequisite.

After the user returns, repeat the two non-Git checks and then require a
successful `git --version`. On other platforms, require `git --version` before
using a Git-backed marketplace or extension command.

### Fluxzero CLI prerequisite

The local MCP server runs `fz mcp`, so
the Fluxzero CLI must be installed and available on the coding agent's `PATH`.
The Codex MCP entry permits task startup while these prerequisites are still missing,
so onboarding can resume after an operating-system confirmation. This does not relax
the readiness checks required before application work.
Verify this before starting application work:

```bash
fz version
```

Install the latest native CLI when that command is unavailable:

**macOS or Linux with Homebrew:**

```bash
brew install fluxzero-io/tap/fluxzero
```

On a bare macOS machine without Homebrew, first complete the Git/Command Line
Tools boundary above and then follow the current installation instructions at
[brew.sh](https://brew.sh). If Homebrew needs user approval, explain the exact
action and stop until it is complete. Follow Homebrew's printed shell setup so
a clean login shell can resolve both `brew` and `fz`; do not replace the
recommended macOS route with an unversioned CLI download.

**Windows with WinGet:**

```powershell
winget install --exact --id Fluxzero.FluxzeroCLI
```

**Linux or another supported Unix environment:**

```bash
curl -sSL https://github.com/fluxzero-io/fluxzero-cli/releases/latest/download/install.sh | sh -s -- --install-path
```

Run `fz version` again after installation. On macOS, also prove that persistent
login configuration—not merely the bootstrap task's inherited environment—can
resolve it:

```bash
env -i HOME="$HOME" USER="$USER" LOGNAME="$LOGNAME" SHELL=/bin/zsh \
  /bin/zsh -l -c 'command -v fz && fz version && fz mcp --help && fz init --help'
```

MCP help must succeed, and init help must list `--in-place`. After activation, require `start_dev` in the MCP tool catalogue.
The default MCP connection serves documentation without starting a project environment.
The `start_dev` MCP tool explicitly starts or reuses that environment when development is needed.

macOS GUI applications do not read `.zprofile`. Publish the verified CLI
directory to processes launched later in the current login session while
preserving any existing launchd path:

```bash
fz_path=$(env -i HOME="$HOME" USER="$USER" LOGNAME="$LOGNAME" SHELL=/bin/zsh \
  /bin/zsh -l -c 'command -v fz')
fz_dir=$(dirname "$fz_path")
launchd_path=$(/bin/launchctl getenv PATH 2>/dev/null || true)
case ":$launchd_path:" in
  *":$fz_dir:"*) ;;
  *)
    if [ -n "$launchd_path" ]; then
      launchd_path="$fz_dir:$launchd_path"
    else
      launchd_path="$fz_dir:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    fi
    /bin/launchctl setenv PATH "$launchd_path"
    ;;
esac
```

This bridge affects only applications launched afterward; it does not update
an already-running Codex/ChatGPT process. The login-shell configuration remains
the persistent installation state.

### Java 25

The Fluxzero CLI checks Java when local development starts. If Java 25 is
missing and the coding agent's execution environment permits software
installation, the agent installs it without asking the user and retries the
original Fluxzero command. Existing agent execution permission is sufficient;
the workflow must not introduce a second confirmation step.

If the environment requires separate user approval for system installation,
the agent asks only: **"Fluxzero needs Java 25. May I install it?"** It then
performs the installation after approval and retries the original Fluxzero
command. The agent never asks the user to run the command or exposes package,
path, runtime, JDK, or environment-variable details in that permission question.

The stable agent-side installation commands are `brew install openjdk@25` on
macOS or Linux with Homebrew and
`winget install --exact --id EclipseAdoptium.Temurin.25.JDK --accept-package-agreements --accept-source-agreements --disable-interactivity`
on Windows. Other Linux environments should use their established package
manager. Successful Fluxzero readiness,
not separate `java` or `javac` shell probes, verifies the result. Generated
projects already include Maven or Gradle wrappers; no system build tool or IDE
is required.

## Authoritative guidance

The plugin intentionally stores only stable installation and workflow rules.
Version-sensitive knowledge stays with the component that owns it:

| Information | Authoritative source |
|:------------|:---------------------|
| CLI installation and agent workflow | This plugin |
| SDK version used by a project | Its effective Maven or Gradle model |
| SDK concepts and APIs for the selected version | The `docs_*` tools on `fluxzero-dev` |
| Current CLI commands | `fz --help` |
| Current dev actions and options | `fz dev --help` |
| `.fluxzero/dev.yaml` schema and defaults | `fz dev config` |
| SDK implementation details when manuals are insufficient | The matching release tag in `https://github.com/fluxzero-io/fluxzero-sdk-java`, never `main` |

Documentation selection uses an explicit version, otherwise the detected project SDK,
otherwise the latest published release. Preserve the returned `namespace` and `version`
in subsequent reads. A version mismatch does not justify changing the project or an
SDK upgrade. Missing artifacts remain visible; do not switch to another SDK's docs.
Existing `.fluxzero/agents` files are legacy synchronized manuals, not the default
retrieval route. Agents inspect existing project configuration and command output;
when guidance differs, command output wins.

Every package provides the same workflow:

- use the Fluxzero CLI and a Java or Kotlin starter for a new, empty project
- preserve the build and layout of an existing project
- compare its SDK with the version advertised by the MCP documentation
- retrieve focused framework guidance instead of reading the whole graph
- let one Fluxzero dev environment watch, compile, run, and test the project
- follow cursored structured feedback to the relevant terminal state after each
  coherent edit
- implement and test a real Fluxzero application rather than a generic service

`fluxzero-dev` runs `fz mcp` in the selected workspace. Its `docs_*` tools use
versioned archives in the shared local cache; warm cached documentation works offline.
The same MCP interface forwards project status, problems, logs and test feedback once
a dev environment is running. Documentation alone opens no project server or watcher.

For a new or empty workspace, complete a `get_status` call and confirm its
`projectDirectory`. `dev-server-not-running` is a valid bootstrap status.
Generate directly there with `fz init --in-place`; do not create and move a named child
project. When development is needed, call `start_dev` with no arguments on the same MCP
connection. It starts or reuses one background environment, subject to the existing
project/empty-workspace checks. Poll `get_status` while `dev-server-starting`; if startup
fails, inspect diagnostics, correct the cause and retry `start_dev`.
Then obtain a fresh status cursor and follow `wait_for_change` through startup and
verification. If a greenfield environment was already running, preserve its
pre-initialization cursor and the same session through generation.

When `fluxzero-dev` is active, agents must not run duplicate wrapper tests,
applications, watchers, or continuous log commands. Project wrappers remain
available for CI and releases; CI owns full regression coverage. The Dev Server
chooses and runs impacted tests. An agent observes those results, makes a new or
changed test pass once, and does not manually rerun tests, existing regression
tests, or the full suite after edits. If verification is explicitly unmanaged,
the agent may run only its new or changed focused test once. If no test is
selected for an edit, a healthy compile/reload is sufficient fresh feedback.
Keep one writer per feature slice so parallel agents do not edit the same files
from different snapshots.

## Install

Before installing, check the agent's native plugin or extension listing and
remember whether Fluxzero was already installed. Reuse an existing installation;
the first-install fork below applies only when this onboarding actually installs
a previously absent plugin, not to an update, reconnect, or missing MCP tool.

### Codex

```bash
codex plugin marketplace add fluxzero-io/fluxzero-agent-plugins
codex plugin add fluxzero@fluxzero
codex plugin list --json
```

Require the final output to list `fluxzero@fluxzero` as installed and enabled.
If `codex` is not on `PATH`, the Codex desktop application bundles the same
command at `/Applications/ChatGPT.app/Contents/Resources/codex`; use that
absolute executable for all three commands. Do not start a new task yet.

### Claude Code

```bash
claude plugin marketplace add fluxzero-io/fluxzero-agent-plugins
claude plugin install fluxzero@fluxzero
```

Defer `/reload-plugins` or a new Claude Code session until the final activation
step below.

### Cursor

The repository contains a Cursor marketplace and plugin manifest ready for
Cursor Marketplace publication. Once listed, install it in Cursor with:

```text
/add-plugin fluxzero
```

For local verification before marketplace approval, copy
`adapters/cursor/fluxzero` to `~/.cursor/plugins/local/fluxzero`, but defer the
Cursor reload until the final activation step below.

### Gemini CLI

```bash
gemini extensions install https://github.com/fluxzero-io/fluxzero-agent-plugins --consent
```

Defer the Gemini CLI restart until the final activation step below.

### GitHub Copilot CLI

```bash
copilot plugin marketplace add fluxzero-io/fluxzero-agent-plugins
copilot plugin install fluxzero@fluxzero
```

Defer the new Copilot CLI session until the final activation step below. The
same plugin components are also available to Copilot app clients that use CLI
plugins.

### Verify readiness, then activate once

After installing the package, finish every prerequisite before refreshing or
restarting the coding agent. Require all of the following evidence:

- the native plugin or extension listing shows Fluxzero installed and enabled
- `git --version` succeeds
- the clean login-shell probe above resolves `fz`, `fz mcp --help` succeeds, the activated MCP exposes
  `start_dev`, and `fz init --help` lists `--in-place`
- Fluxzero development readiness succeeds; if Java 25 was initially missing,
  the agent installed it and retried the original command, obtaining separate
  approval only when the execution environment required it
- on macOS, the launchd `PATH` bridge includes the directory containing `fz`

Do not equate a successful marketplace command, archive download, or
interactive-shell check with readiness. Do not ask for application requirements
while any item is missing.

Only after every check passes, activate the plugin through the current agent's
supported mechanism. For Codex, follow the [Codex activation instructions](plugins/fluxzero/instructions.md).
Specific supplements for other agents will be added after their workflows have
been qualified; do not apply Codex's fork instructions to other agents.

Preserve the current directory, checkout, and user's request. A stale inherited
`PATH` requires a full process relaunch. Ask for a manual activation action only
when the agent cannot perform it itself.

In the first activated task, confirm that the `build-fluxzero-app` skill is
available, call `docs_start` through `fluxzero-dev`, and complete a
`get_status` call through `fluxzero-dev` before application work. Merely seeing
the development server in configuration or a tool catalogue is not readiness.
In an empty workspace, the status call must still succeed and identify that
workspace as its project directory. If either completed call is unavailable,
stop and repair the plugin or process environment; do not bypass it with a
duplicate wrapper build or a separately started development server.

### Let the coding agent install its Fluxzero package

This minimal prompt is intentionally agent-neutral:

```text
I want to build an application using Fluxzero. Follow the onboarding instructions at https://plugins.fluxzero.io to install the Fluxzero plugin and prepare this environment.
Let me know when everything is ready for my application requirements.
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
their different instruction-file discovery rules. SDK-versioned manuals
synchronized by the Fluxzero CLI remain valid managed project context; agents
must not replace them with hand-maintained copies. An unavailable plugin or
extension is a bootstrap boundary, not permission to implement from stale
unmanaged docs.

## Repository layout

`skills/build-fluxzero-app/common.md` contains the shared skill, including its
frontmatter. An agent's directory can contain an optional `instructions.md` source.
Currently only Codex has a supplement; other agents receive the shared skill.
`npm run generate` joins the shared skill and that agent's supplement into a
self-contained `SKILL.md`; Gemini's generated skill lives at the repository
root under `skills/`. Edit the sources, not the generated skills.

`scripts/agent-skills.mjs` lists the five source/output pairs. The generator also
renders agent-specific manifests, MCP configurations, and marketplace catalogs.
CI checks source composition, generated drift, and isolation of activation
instructions between agents.

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
