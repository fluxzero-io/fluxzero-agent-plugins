---
name: devboard
description: Open the Fluxzero Devboard for the current project, or return its current link. Use when the user asks for Devboard, their project dashboard, or its App preview, Workspace, Progress, Tests or Startup page.
---

# Open Devboard

Use the project's `fluxzero-dev` MCP connection. Read `get_workflow` with topic
`preview` for current URL discovery, supported pages and opening behavior.
Check the selected project and reuse its running environment. If development
must start, use the supported MCP start action and reread the workflow afterward.
Respect the user's chosen browser and leave the requested page open; provide a
clickable live link if opening is unavailable. Do not rerun tests or change
Progress just to show Devboard.

For older servers without workflow discovery, inspect `get_status` for an
explicit console URL. Open it when present; otherwise explain the missing
capability instead of guessing a localhost port or path. Preserve version pins.
Use the build skill's installation guidance when CLI/MCP readiness is missing.
