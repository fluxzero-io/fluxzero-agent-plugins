import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import test from "node:test";

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("generated adapters are current", async () => {
  const { stdout } = await execFileAsync(process.execPath, ["scripts/generate-plugins.mjs", "--check"], { cwd: root });
  assert.match(stdout, /current/);
});

test("every packaged agent receives the exact canonical skill", async () => {
  const canonical = await readFile(path.join(root, "skills/build-fluxzero-app/SKILL.md"));
  const copies = [
    "plugins/fluxzero/skills/build-fluxzero-app/SKILL.md",
    "adapters/claude/fluxzero/skills/build-fluxzero-app/SKILL.md",
    "adapters/cursor/fluxzero/skills/build-fluxzero-app/SKILL.md",
    "adapters/copilot/fluxzero/skills/build-fluxzero-app/SKILL.md",
  ];
  for (const copy of copies) {
    assert.deepEqual(await readFile(path.join(root, copy)), canonical);
  }
});

test("canonical instructions document the Fluxzero CLI prerequisite on every platform", async () => {
  const files = [
    "README.md",
    "skills/build-fluxzero-app/SKILL.md",
    "project-instructions/AGENTS.md",
  ];
  const requiredInstructions = [
    "fz version",
    "brew install fluxzero-io/tap/fluxzero",
    "winget install --exact --id Fluxzero.FluxzeroCLI",
    "https://github.com/fluxzero-io/fluxzero-cli/releases/latest/download/install.sh",
  ];

  for (const file of files) {
    const content = await readFile(path.join(root, file), "utf8");
    for (const instruction of requiredInstructions) {
      assert.ok(content.includes(instruction), `${file} must document ${instruction}`);
    }
  }
});

test("canonical instructions delegate evolving CLI and dev configuration to installed commands", async () => {
  const files = [
    "README.md",
    "skills/build-fluxzero-app/SKILL.md",
    "project-instructions/AGENTS.md",
  ];
  const authoritativeCommands = [
    "fz --help",
    "fz dev --help",
    "fz dev config",
  ];

  for (const file of files) {
    const content = await readFile(path.join(root, file), "utf8");
    for (const command of authoritativeCommands) {
      assert.ok(content.includes(command), `${file} must delegate to ${command}`);
    }
    assert.match(content, /command output (?:ever )?(?:differ|wins)|command output wins/i);
  }
});

test("canonical instructions define the complete version-aware authority map", async () => {
  const files = [
    "README.md",
    "skills/build-fluxzero-app/SKILL.md",
    "project-instructions/AGENTS.md",
  ];
  const requiredSources = [
    "fluxzero-docs",
    ".fluxzero/agents",
    "Maven or Gradle",
    "https://github.com/fluxzero-io/fluxzero-sdk-java",
    "release tag",
  ];

  for (const file of files) {
    const content = await readFile(path.join(root, file), "utf8");
    for (const source of requiredSources) {
      assert.ok(content.includes(source), `${file} must identify ${source} as an authoritative source`);
    }
    assert.match(content, /never `main`/);
  }
});

test("all adapters expose separate documentation and development MCP servers", async () => {
  const config = JSON.parse(await readFile(path.join(root, "plugins.config.json"), "utf8"));
  const paths = [
    "plugins/fluxzero/.mcp.json",
    "adapters/claude/fluxzero/.mcp.json",
    "adapters/cursor/fluxzero/mcp.json",
    "adapters/copilot/fluxzero/.mcp.json",
  ];
  for (const mcpPath of paths) {
    const value = JSON.parse(await readFile(path.join(root, mcpPath), "utf8"));
    assert.equal(value.mcpServers["fluxzero-docs"].url, config.mcpUrl);
    assert.equal(value.mcpServers["fluxzero-dev"].command, config.devMcpCommand);
    assert.deepEqual(value.mcpServers["fluxzero-dev"].args, config.devMcpArgs);
  }
  const gemini = JSON.parse(await readFile(path.join(root, "gemini-extension.json"), "utf8"));
  assert.equal(gemini.mcpServers["fluxzero-docs"].httpUrl, config.mcpUrl);
  assert.equal(gemini.mcpServers["fluxzero-dev"].command, config.devMcpCommand);
  assert.deepEqual(gemini.mcpServers["fluxzero-dev"].args, config.devMcpArgs);
});
