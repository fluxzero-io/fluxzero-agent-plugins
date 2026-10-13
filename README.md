<a href="https://fluxzero.io"><img src="https://raw.githubusercontent.com/fluxzero-io/.github/3fa8f79df95d07678a730147bc1bd0402ae660d5/assets/brand/2026-09/repository-header.svg" alt="Fluxzero — The European cloud for AI-built apps" width="1280"></a>

# Fluxzero Agent Plugins

Plugins for using [Fluxzero](https://fluxzero.io) with your coding agent.

This repository distributes Fluxzero plugins for Codex, Claude Code, Cursor,
and GitHub Copilot, plus the equivalent Gemini CLI extension. Every package
contains the shared application-building workflow with an optional agent-specific activation supplement and configures one local MCP server for versioned documentation and development feedback.
Install the package for your coding agent once; projects do not need
hand-maintained Fluxzero manuals or duplicate MCP registrations.

## MCP connection name

The plugin MCP connection is named `fluxzero` (Fluxzero). Older plugin versions, project instructions and server workflows may call it `fluxzero-dev`; this is the same integration. Use the available Fluxzero connection and its advertised tools, and never register a second connection just to provide the old name.

Version 0.5.0 renames the bundled MCP registration from `fluxzero-dev` to
`fluxzero` across all clients. Tool names, arguments and `fz mcp` stay the same.
Update any manually configured tool allowlists keyed by the old server name;
refresh plugin tools through the client’s native reload mechanism. Existing
chat history can retain the old name. Do not add a second server as an alias.

## Open Devboard

The `devboard` skill opens the current project's Devboard using its live MCP
status, reusing the running environment and its browser tab where possible.
It defaults to App preview; you can also request Workspace, Progress, Tests or
Startup. Invoke it through your client's skill picker, `$devboard` in Codex,
or `/fluxzero:devboard` for the Claude Code plugin. Client command prefixes vary.
If no browser-opening tool is available, it returns the current link.

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

### Automatic CLI updates

After verifying the CLI, inspect `fz upgrade --help`. When it lists `--auto-update`,
enable the default for all supported coding agents and read back the saved preference:

```bash
fz upgrade --auto-update enable-if-unset
fz upgrade --auto-update status
```

This configures the CLI without upgrading immediately. Ordinary CLI use checks in a
separate background process at most once every three days and installs newer stable
releases within the current major through the original installer. Running development
environments and project SDK dependencies remain unchanged. These settings are
independent of [automatic plugin updates](#install).

Preserve explicit opt-outs, package-manager pins and managed policies. The onboarding
command leaves an existing preference intact; `fz upgrade --auto-update disable`
disables updates explicitly. `FLUXZERO_CLI_AUTO_UPDATE=false` and `CI=true` suppress
background updates even when enabled. Read-only installations, unavailable packages
and network failures are deferred without blocking normal CLI use.

If an older CLI does not support the option, briefly report that automatic CLI updates
require a newer CLI. Use its owning installer's normal upgrade route when appropriate,
respecting existing pins and policies; continue supported work without repeated checks
or prompts. Include CLI and plugin update status in the brief onboarding summary.

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
| CLI installation and stable working agreements | This plugin |
| Current dev-server workflows | `get_workflow` on `fluxzero` |
| SDK version used by a project | Its effective Maven or Gradle model |
| SDK concepts and APIs for the selected version | The `docs_*` tools on `fluxzero` |
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

`fluxzero` runs `fz mcp` in the selected workspace. Its `docs_*` tools use
versioned archives in the shared local cache; warm cached documentation works offline.
The same MCP interface forwards project status, problems, logs and test feedback once
a dev environment is running. With a dev-server distribution that includes Devboard
monitoring tools, agents can also investigate audit messages, application logs,
traces, issues, Insights, Workspace resources and stored documents directly. The
server's `get_workflow` tool describes current development, preview, monitoring,
Progress and startup workflows. The plugin retains stable intent and routing;
workflow details travel with the owning server rather than requiring a plugin
upgrade. The stdio connection forwards workflow requests to the selected running
server, or serves its own version before startup. Older servers without discovery
use their advertised tools and CLI help; pins are never changed for this fallback.
Documentation alone opens no project server or watcher.

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

`start_dev` already starts in background mode. An interactive `fz dev` session
owns its environment until explicitly detached; closing its terminal stops it.
For an explicit CLI/local-build launch from a temporary agent shell, choose the
launcher's background mode and the execution tool's supported detached process
session. `nohup` alone does not isolate a Unix process group from tool cleanup.
Verify fresh project status and the URL after the launching command exits before
reporting that an environment will remain available.

When `fluxzero` is active, agents must not run duplicate wrapper tests,
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
reuse an existing installation. Installation or an update does not by itself
require a new conversation; verify activation in the current conversation.

As part of onboarding, enable native automatic updates for Fluxzero using the
agent-specific steps below, including when reusing an installation. Preserve
explicit user opt-outs, pinned versions and managed policies. Change only the
Fluxzero entry and preserve other settings. Verify the saved preference; an
installed or enabled plugin does not prove that automatic updates are on.
When the installed client or distribution route cannot enable them, use the
[occasional update check](#occasional-update-check) instead.

### Codex

```bash
codex plugin marketplace add fluxzero-io/fluxzero-agent-plugins
codex plugin add fluxzero@fluxzero
codex plugin list --json
```

Require the final output to list `fluxzero@fluxzero` as installed and enabled.
If `codex` is not on `PATH`, the Codex desktop application bundles the same
command at `/Applications/ChatGPT.app/Contents/Resources/codex`; use that
absolute executable for all three commands. Keep the current task.

For this custom Git marketplace, no supported automatic-update setting is
documented. Occasionally refresh just Fluxzero with
`codex plugin marketplace upgrade fluxzero`, then check
`codex plugin list --json` and activate any changed tools through the normal
Codex activation flow below. The refresh can update installed files; it is not
a read-only check. Keep the configured source and ref.

### Claude Code

```bash
claude plugin marketplace add fluxzero-io/fluxzero-agent-plugins
claude plugin install fluxzero@fluxzero
```

Enable automatic updates for the `fluxzero` marketplace. Set
`extraKnownMarketplaces.fluxzero.autoUpdate` to `true` in the active user settings
(normally `~/.claude/settings.json`, or under `CLAUDE_CONFIG_DIR`), preserving
the registered source and all other fields. Alternatively use `/plugin` →
**Marketplaces** → **fluxzero** → **Enable auto-update**. Verify the effective
preference in that menu, including higher-priority settings and any global
update-disable environment variables; do not override an explicit opt-out.
See [Claude Code's update rules](https://code.claude.com/docs/en/plugins/loading#which-marketplaces-and-plugins-auto-update).

Recent Claude Code versions apply installations from the `/plugin` menu when
you close it. For an external CLI installation or pending changes, use
`/reload-plugins` in the current session during the final activation step below.

### Cursor

The repository contains a Cursor marketplace and plugin manifest ready for
Cursor Marketplace publication. Once listed, install it in Cursor with:

```text
/add-plugin fluxzero
```

For local verification before marketplace approval, copy
`adapters/cursor/fluxzero` to `~/.cursor/plugins/local/fluxzero`, but defer the
Cursor reload until the final activation step below.

For an existing GitHub-backed team marketplace dedicated to Fluxzero, enable **Auto Refresh** in
**Dashboard → Plugins & MCPs → Team Marketplaces → Marketplace Settings** when
the user has marketplace-management access and the Cursor GitHub App is already
installed on the repository. Verify the saved setting. This refreshes the team
catalog after pushes; it is not a per-user toggle for local plugins. Do not
change update policy for other team plugins, create a team marketplace or
install a GitHub App merely to enable updates.

Otherwise, occasionally check Fluxzero in Cursor's plugin manager and apply
available updates. For a local copy, compare its manifest version with the
source repository and refresh `adapters/cursor/fluxzero` from the selected
release, preserving local edits, then reload Cursor when needed.
See [Cursor's marketplace update guide](https://cursor.com/docs/plugins#keep-plugins-up-to-date).

### Gemini CLI

```bash
gemini extensions install https://github.com/fluxzero-io/fluxzero-agent-plugins --consent --auto-update
```

The `--auto-update` flag enables updates for this extension. For an existing
installation, inspect `gemini extensions --help` and its extension settings for
a supported way to enable the preference without reinstalling or losing a ref
or local settings. If unavailable, use the occasional check with
`gemini extensions update fluxzero`; do not confuse CLI self-updates with
extension updates. See [Gemini's extension reference](https://geminicli.com/docs/extensions/reference/).

Defer the Gemini CLI restart until the final activation step below.

### GitHub Copilot CLI

```bash
copilot plugin marketplace add fluxzero-io/fluxzero-agent-plugins
copilot plugin install fluxzero@fluxzero
```

Set `autoUpdate: true` on the `fluxzero` entry under `extraKnownMarketplaces`
in the active **user** settings (normally `~/.copilot/settings.json`, or under
`COPILOT_HOME`), preserving the registered source and other fields. Verify the
saved entry and effective settings. Repository settings cannot enable this
preference. Automatic plugin updates run in interactive and `-p` sessions, not
SDK or server sessions; global update-disable settings can also prevent them.
For those cases or older clients without this setting, occasionally run
`copilot plugin update fluxzero@fluxzero`.
See [Copilot's plugin update reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference#copilot-plugin-update-options).

Defer the new Copilot CLI session until the final activation step below. The
same plugin components are also available to Copilot app clients that use CLI
plugins.

### Occasional update check

When automatic updates are unavailable, check Fluxzero when starting a new
project or returning after several days, using the current agent's route above.
Do not check on every prompt or interrupt active development. Respect pins and
explicit update opt-outs; for those, report an available update without applying
it. Do not add scheduled jobs or update unrelated plugins. If offline, retain
the working installation and defer the check.

Finish onboarding with one brief update-status line: automatic updates enabled,
an existing opt-out preserved, or "Fluxzero plugin updates are manual here;
check occasionally in the plugin manager or ask your agent to update Fluxzero."
Mention any required native action only when the agent cannot perform it.
After an update, use the client's supported activation flow and verify the
skill, documentation and status tools; downloading is not activation.

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
For Claude Code, use `/reload-plugins` if changes are still pending; a new
session is not the default. Use the documented native activation mechanism for
other clients.

Preserve the current directory, checkout, and user's request. A stale inherited
`PATH` requires a full process relaunch. Ask for a manual activation action only
when the agent cannot perform it itself.

After activation in the current conversation, confirm that the `build-fluxzero-app` skill is
available, call `docs_start` through `fluxzero`, and complete a
`get_status` call through `fluxzero` before application work. Merely seeing
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

### Plugin branding

`plugins.config.json` defines the shared icon and brand colors. The source PNG
in `assets/brand/` is the existing Fluxzero website mark, with transparency for
both light and dark backgrounds. The generator copies it into each package that
declares an icon; edit the source asset rather than the generated copies.

| Client | Presentation support |
| --- | --- |
| Codex | Listing logo, composer icon, and light/dark brand colors in `interface`. |
| Claude Code | `icon` for Anthropic's directory listing. Claude Code ignores it at load time; validation accepts it without warnings from v2.1.281 onward. Older validators can warn, and strict validation can fail. |
| Cursor | `logo` pointing to the packaged asset. |
| GitHub Copilot CLI | Shared name, description, author and homepage. Its documented legacy manifest has no logo field. |
| Gemini CLI | Shared name and description. Its documented extension manifest has no logo field. |

Copilot and Gemini still receive the shared skills and local development MCP
server. Logo rendering is a separate client capability. The logo metadata used
by Awesome Copilot's Canvas extension gallery is not a general CLI plugin icon.

References: [Codex](https://developers.openai.com/plugins/deploy/submission),
[Claude Code](https://code.claude.com/docs/en/plugins-reference#directory-listing-fields),
[Cursor](https://prod.cursor.com/docs/reference/plugins),
[Copilot CLI](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference),
[Gemini CLI](https://geminicli.com/docs/extensions/reference/).

### Generate and validate

```bash
npm run generate
npm test
```

CI uses Node.js 24 LTS. Dependabot checks GitHub Actions daily and groups minor
and patch updates. Those updates can merge through the Fluxzero Dependabot App
after the required `validate` check passes against the current main branch.
Major updates require separate review. The existing version-based release flow
runs after successful validation on main.

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


---

<p align="center"><strong>Are you a builder or coding agent?</strong><br>We welcome your ideas, issues, and pull requests!</p>

<p align="center">
  <a href="https://github.com/fluxzero-io/fluxzero-sdk-java"><picture><source media="(max-width: 520px) and (prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/sdk-mobile-dark.svg"><source media="(max-width: 520px)" srcset="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/sdk-mobile-light.svg"><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/sdk-dark.svg"><img src="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/sdk-light.svg" alt="SDK — Connect your code to Fluxzero"></picture></a>
  <a href="https://github.com/fluxzero-io/fluxzero-agent-plugins"><picture><source media="(max-width: 520px) and (prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/agents-mobile-dark.svg"><source media="(max-width: 520px)" srcset="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/agents-mobile-light.svg"><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/agents-dark.svg"><img src="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/agents-light.svg" alt="Agent plugins — Guide your coding agent"></picture></a>
  <a href="https://github.com/fluxzero-io/fluxzero-cli"><picture><source media="(max-width: 520px) and (prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/cli-mobile-dark.svg"><source media="(max-width: 520px)" srcset="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/cli-mobile-light.svg"><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/cli-dark.svg"><img src="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/cli-light.svg" alt="CLI — Create, run, and deploy apps"></picture></a>
  <a href="https://github.com/fluxzero-io/fluxzero-dev-server"><picture><source media="(max-width: 520px) and (prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/dev-server-mobile-dark.svg"><source media="(max-width: 520px)" srcset="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/dev-server-mobile-light.svg"><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/dev-server-dark.svg"><img src="https://raw.githubusercontent.com/fluxzero-io/.github/21a1ad90e2cd306a35b6f7f9f969f500e99dd70a/assets/brand/2026-09/profile/dev-server-light.svg" alt="Dev Server — Develop and test locally"></picture></a>
</p>

<p align="center">
  <a href="https://fluxzero.io/">Website</a> &nbsp;·&nbsp;
  <a href="https://fluxzero.io/how-it-works">How it works</a> &nbsp;·&nbsp;
  <a href="https://fluxzero.io/docs">Docs</a> &nbsp;·&nbsp;
  <a href="https://fluxzero.io/about">About us</a> &nbsp;·&nbsp;
  <a href="https://fluxzero.io/contact">Contact us</a>
</p>
