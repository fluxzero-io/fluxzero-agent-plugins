#!/usr/bin/env node
import { agentSkills, composeSkill, sharedSkillCopies } from "./agent-skills.mjs";

import { lstat, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = await readJson("plugins.config.json");
const packageJson = await readJson("package.json");
const failures = [];

function fail(message) {
  failures.push(message);
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

async function assertPath(relativePath) {
  try {
    await lstat(path.join(root, relativePath));
  } catch {
    fail(`${relativePath} does not exist`);
  }
}

function assertEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

if (!/^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(config.version)) {
  fail(`plugin version is not semantic: ${config.version}`);
}
assertEqual(packageJson.version, config.version, "package and plugin version");
if (!config.repository.startsWith("https://github.com/fluxzero-io/")) fail("repository must use the Fluxzero GitHub organization");
assertEqual(config.devMcpCommand, "fz", "development MCP command");
assertEqual(config.devMcpArgs, ["mcp"], "development MCP arguments");

const canonicalSkill = await readFile(path.join(root, "skills/build-fluxzero-app/common.md"), "utf8");
for (const [source, target] of agentSkills) {
  const supplement = source ? await readFile(path.join(root, source), "utf8") : "";
  const actual = await readFile(path.join(root, target), "utf8");
  if (actual !== composeSkill(canonicalSkill, supplement)) fail(`${target} differs from its sources`);
}

for (const [source, target] of sharedSkillCopies) {
  const expected = await readFile(path.join(root, source), "utf8");
  assertEqual(await readFile(path.join(root, target), "utf8"), expected, target);
}

const frontmatter = canonicalSkill.match(/^---\n([\s\S]*?)\n---\n/);
if (!frontmatter) {
  fail("SKILL.md has no YAML frontmatter");
} else {
  const keys = frontmatter[1]
    .split("\n")
    .filter((line) => /^[a-z-]+:/.test(line))
    .map((line) => line.slice(0, line.indexOf(":")));
  assertEqual(keys, ["name", "description"], "SKILL.md frontmatter keys");
  if (!frontmatter[1].includes("name: build-fluxzero-app")) fail("SKILL.md name does not match its directory");
}

const manifests = {
  codex: ["plugins/fluxzero", ".codex-plugin/plugin.json", "./.mcp.json"],
  claude: ["adapters/claude/fluxzero", ".claude-plugin/plugin.json", "./.mcp.json"],
  cursor: ["adapters/cursor/fluxzero", ".cursor-plugin/plugin.json", "./mcp.json"],
  copilot: ["adapters/copilot/fluxzero", "plugin.json", "./.mcp.json"],
};

for (const [agent, [adapterRoot, manifestPath, mcpPath]] of Object.entries(manifests)) {
  const manifest = await readJson(path.posix.join(adapterRoot, manifestPath));
  assertEqual(manifest.name, config.name, `${agent} plugin name`);
  assertEqual(manifest.version, config.version, `${agent} plugin version`);
  assertEqual(manifest.repository, config.repository, `${agent} repository`);
  assertEqual(manifest.skills, "./skills/", `${agent} skills path`);
  assertEqual(manifest.mcpServers, mcpPath, `${agent} MCP path`);
  await assertPath(path.posix.join(adapterRoot, manifest.skills));
  await assertPath(path.posix.join(adapterRoot, manifest.mcpServers));
}

const codexMcp = (await readJson("plugins/fluxzero/.mcp.json")).mcpServers;
const claudeMcp = (await readJson("adapters/claude/fluxzero/.mcp.json")).mcpServers;
const cursorMcp = (await readJson("adapters/cursor/fluxzero/mcp.json")).mcpServers;
const copilotMcp = (await readJson("adapters/copilot/fluxzero/.mcp.json")).mcpServers;
const gemini = await readJson("gemini-extension.json");

assertEqual(codexMcp["fluxzero-dev"].command, config.devMcpCommand, "Codex dev MCP command");
assertEqual(codexMcp["fluxzero-dev"].args, config.devMcpArgs, "Codex dev MCP arguments");
assertEqual(
  claudeMcp["fluxzero-dev"],
  { type: "stdio", command: config.devMcpCommand, args: config.devMcpArgs },
  "Claude dev MCP configuration",
);
assertEqual(cursorMcp["fluxzero-dev"], { command: config.devMcpCommand, args: config.devMcpArgs }, "Cursor dev MCP configuration");
assertEqual(copilotMcp["fluxzero-dev"].command, config.devMcpCommand, "Copilot dev MCP command");
assertEqual(copilotMcp["fluxzero-dev"].args, config.devMcpArgs, "Copilot dev MCP arguments");
assertEqual(gemini.name, config.name, "Gemini extension name");
assertEqual(gemini.version, config.version, "Gemini extension version");
assertEqual(gemini.mcpServers["fluxzero-dev"].command, config.devMcpCommand, "Gemini dev MCP command");
assertEqual(gemini.mcpServers["fluxzero-dev"].args, config.devMcpArgs, "Gemini dev MCP arguments");

for (const servers of [codexMcp, claudeMcp, cursorMcp, copilotMcp, gemini.mcpServers]) {
  assertEqual(Object.keys(servers), ["fluxzero-dev"], "one local MCP for documentation and development");
}
assertEqual(codexMcp["fluxzero-dev"].required, false, "MCP startup must allow incomplete CLI onboarding");

const marketplaces = {
  codex: [".agents/plugins/marketplace.json", "./plugins/fluxzero"],
  claude: [".claude-plugin/marketplace.json", "./adapters/claude/fluxzero"],
  cursor: [".cursor-plugin/marketplace.json", "fluxzero"],
  copilot: [".github/plugin/marketplace.json", "./adapters/copilot/fluxzero"],
};
for (const [agent, [marketplacePath, source]] of Object.entries(marketplaces)) {
  const marketplace = await readJson(marketplacePath);
  assertEqual(marketplace.name, config.name, `${agent} marketplace name`);
  assertEqual(marketplace.plugins.length, 1, `${agent} marketplace plugin count`);
  const actualSource = marketplace.plugins[0].source?.path ?? marketplace.plugins[0].source;
  assertEqual(actualSource, source, `${agent} marketplace source`);
}

const readme = await readFile(path.join(root, "README.md"), "utf8");
const agents = await readFile(path.join(root, "project-instructions/AGENTS.md"), "utf8");
const claudeInstructions = await readFile(path.join(root, "project-instructions/CLAUDE.md"), "utf8");
const geminiInstructions = await readFile(path.join(root, "project-instructions/GEMINI.md"), "utf8");
for (const [label, content] of [
  ["README.md", readme],
  ["project AGENTS.md", agents],
  ["project CLAUDE.md", claudeInstructions],
  ["project GEMINI.md", geminiInstructions],
]) {
  if (!content.includes("fluxzero-io/fluxzero-agent-plugins")) fail(`${label} does not reference the current repository`);
}
if (!claudeInstructions.startsWith("@AGENTS.md")) fail("CLAUDE.md must import AGENTS.md");
if (!geminiInstructions.startsWith("@./AGENTS.md")) fail("GEMINI.md must import AGENTS.md");
if (!agents.includes("Do not add hand-maintained Fluxzero manuals")) {
  fail("AGENTS.md must reject hand-maintained manual copies");
}

async function rejectSymlinks(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const itemPath = path.join(directory, entry.name);
    const stats = await lstat(itemPath);
    if (stats.isSymbolicLink()) fail(`${path.relative(root, itemPath)} is a symlink`);
    if (stats.isDirectory()) await rejectSymlinks(itemPath);
  }
}
await rejectSymlinks(root);

if (failures.length > 0) {
  console.error("Plugin validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("All Fluxzero agent plugins are valid.");
}
