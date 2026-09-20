---
name: devboard
description: Open the Fluxzero Devboard for the current project, or return its current link. Use when the user asks for Devboard, their project dashboard, or its App preview, Workspace, Progress, Tests or Startup page.
---

# Open Devboard

1. Use the plugin's `fluxzero-dev` MCP connection. Call `get_status` and
   check the returned project directory against the user's intended project.
   If it differs, use `select_project` when available with the confirmed app
   directory, then read status again. Resolve ambiguity before opening or
   starting a different project. Never choose a project from a remembered port.
2. Reuse the running environment. If this project has no running dev server,
   use `start_dev` on that connection to start it, then follow `get_status`
   until the gateway is available or startup fails. Do not restart an active
   environment just to open Devboard. If the CLI or MCP is unavailable, use the
   plugin's build-fluxzero-app onboarding guidance; do not invent a launch command.
3. Get the live URL from the returned environment. Prefer an explicitly returned
   `consoleUrl`. Otherwise, a session gateway advertising
   `metadata.devConsoleVersion: "1"` serves Devboard at
   `<session.gateway.url>/_fluxzero/dev/`. If neither is available, explain that
   this server does not expose a supported Devboard instead of guessing.
4. Open the requested page: `#application` for App preview (the default),
   `#projects` for Workspace, `#progress`, `#tests`, or `#startup`.
   Reuse a matching browser tab when possible. Respect the user's chosen browser;
   otherwise use the host's available browser-opening tool. Verify the resulting
   page when browser inspection is available and leave it open for the user.
5. Return a concise clickable link. If opening is unavailable, provide the link
   without claiming to have opened it. A localhost URL is only reachable on the
   machine running the dev server; for a remote session explain that limitation
   rather than exposing a port or changing network access.

Opening Devboard does not require rerunning tests, changing project data, or
updating Progress. Keep this action focused on showing the requested page.
