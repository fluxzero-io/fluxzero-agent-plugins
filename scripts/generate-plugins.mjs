#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { agentSkills, composeSkill } from "./agent-skills.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(await readFile(path.join(root, "plugins.config.json"), "utf8"));
const skill = await readFile(path.join(root, "skills/build-fluxzero-app/common.md"), "utf8");
const adapterPaths = {
  codex: "./plugins/fluxzero",
  claude: "./adapters/claude/fluxzero",
  cursor: "adapters/cursor/fluxzero",
  copilot: "./adapters/copilot/fluxzero",
};

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

const commonManifest = {
  name: config.name,
  version: config.version,
  description: config.description,
  author: config.author,
  homepage: config.homepage,
  repository: config.repository,
  license: config.license,
  keywords: config.keywords,
};

const devMcp = {
  command: config.devMcpCommand,
  args: config.devMcpArgs,
};

const outputs = new Map([
  ...await Promise.all(agentSkills.map(async ([source, target]) => [
    target, composeSkill(skill, source ? await readFile(path.join(root, source), "utf8") : ""),
  ])),
  [
    "plugins/fluxzero/.codex-plugin/plugin.json",
    json({
      ...commonManifest,
      skills: "./skills/",
      mcpServers: "./.mcp.json",
      interface: {
        displayName: config.displayName,
        shortDescription: "Build and extend Fluxzero applications.",
        longDescription:
          "Fluxzero gives Codex a safe workflow for new and existing Java or Kotlin projects, current selectively retrieved documentation, and structured local development feedback.",
        developerName: config.author.name,
        category: "Productivity",
        capabilities: ["Application development", "MCP documentation", "Automated development feedback"],
        defaultPrompt: [
          "Build a new Fluxzero application from this brief.",
          "Extend this existing Fluxzero application.",
          "Migrate this service to Fluxzero without replacing unrelated code.",
        ],
      },
    }),
  ],
  [
    "adapters/claude/fluxzero/.claude-plugin/plugin.json",
    json({
      ...commonManifest,
      displayName: config.displayName,
      skills: "./skills/",
      mcpServers: "./.mcp.json",
    }),
  ],
  [
    "adapters/cursor/fluxzero/.cursor-plugin/plugin.json",
    json({
      name: config.name,
      displayName: config.displayName,
      version: config.version,
      description: config.description,
      author: { name: config.author.name },
      homepage: config.homepage,
      repository: config.repository,
      license: config.license,
      keywords: config.keywords,
      category: "developer-tools",
      tags: ["framework", "java", "kotlin"],
      skills: "./skills/",
      mcpServers: "./mcp.json",
    }),
  ],
  [
    "adapters/copilot/fluxzero/plugin.json",
    json({
      ...commonManifest,
      category: "Developer Tools",
      tags: ["framework", "java", "kotlin"],
      skills: "./skills/",
      mcpServers: "./.mcp.json",
    }),
  ],
  [
    "plugins/fluxzero/.mcp.json",
    json({
      mcpServers: {
        "fluxzero-dev": {
          ...devMcp,
          // The CLI may still be missing when onboarding resumes after an OS confirmation.
          required: false,
          startup_timeout_sec: 120,
          tool_timeout_sec: 120,
          default_tools_approval_mode: "approve",
        },
      },
    }),
  ],
  [
    "adapters/claude/fluxzero/.mcp.json",
    json({
      mcpServers: {
        "fluxzero-dev": {
          type: "stdio",
          ...devMcp,
        },
      },
    }),
  ],
  [
    "adapters/cursor/fluxzero/mcp.json",
    json({
      mcpServers: {
        "fluxzero-dev": devMcp,
      },
    }),
  ],
  [
    "adapters/copilot/fluxzero/.mcp.json",
    json({
      mcpServers: {
        "fluxzero-dev": {
          type: "stdio",
          ...devMcp,
          tools: ["*"],
          deferTools: "auto",
          timeout: 120000,
        },
      },
    }),
  ],
  [
    ".agents/plugins/marketplace.json",
    json({
      name: config.name,
      interface: { displayName: config.displayName },
      plugins: [
        {
          name: config.name,
          source: { source: "local", path: adapterPaths.codex },
          policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
          category: "Productivity",
        },
      ],
    }),
  ],
  [
    ".claude-plugin/marketplace.json",
    json({
      name: config.name,
      owner: { name: config.author.name },
      metadata: {
        description: "Fluxzero plugins for coding agents.",
        version: config.version,
      },
      plugins: [
        {
          name: config.name,
          source: adapterPaths.claude,
          description: config.description,
          version: config.version,
          author: config.author,
          homepage: config.homepage,
          repository: config.repository,
          license: config.license,
          keywords: config.keywords,
          category: "development",
        },
      ],
    }),
  ],
  [
    ".cursor-plugin/marketplace.json",
    json({
      name: config.name,
      owner: { name: config.author.name },
      metadata: {
        description: "Fluxzero plugins for coding agents.",
        pluginRoot: "adapters/cursor",
      },
      plugins: [
        {
          name: config.name,
          source: config.name,
          description: config.description,
        },
      ],
    }),
  ],
  [
    ".github/plugin/marketplace.json",
    json({
      name: config.name,
      owner: { name: config.author.name },
      metadata: {
        description: "Fluxzero plugins for coding agents.",
        version: config.version,
      },
      plugins: [
        {
          name: config.name,
          source: adapterPaths.copilot,
          description: config.description,
          version: config.version,
          author: config.author,
          homepage: config.homepage,
          repository: config.repository,
          license: config.license,
          keywords: config.keywords,
          category: "Developer Tools",
          tags: ["framework", "java", "kotlin"],
        },
      ],
    }),
  ],
  [
    "gemini-extension.json",
    json({
      name: config.name,
      version: config.version,
      description: config.description,
      mcpServers: {
        "fluxzero-dev": {
          ...devMcp,
          timeout: 120000,
        },
      },
    }),
  ],
]);

const check = process.argv.includes("--check");
const drift = [];

for (const [relativePath, expected] of outputs) {
  const absolutePath = path.join(root, relativePath);
  if (check) {
    let actual;
    try {
      actual = await readFile(absolutePath, "utf8");
    } catch {
      drift.push(`${relativePath} is missing`);
      continue;
    }
    if (actual !== expected) {
      drift.push(`${relativePath} differs from generated output`);
    }
  } else {
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, expected);
  }
}

if (drift.length > 0) {
  console.error("Generated plugin files are stale:");
  for (const item of drift) console.error(`- ${item}`);
  process.exitCode = 1;
} else {
  console.log(check ? "Generated plugin files are current." : `Generated ${outputs.size} plugin files.`);
}
