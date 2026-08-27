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

test("canonical instructions document the complete environment prerequisite on every platform", async () => {
  const files = [
    "README.md",
    "skills/build-fluxzero-app/SKILL.md",
    "project-instructions/AGENTS.md",
  ];
  const requiredInstructions = [
    "git --version",
    "fz version",
    "fz mcp --help",
    "--ensure-dev",
    "java -version",
    "javac -version",
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

test("bare macOS onboarding has one explicit Command Line Tools boundary", async () => {
  const files = [
    "README.md",
    "skills/build-fluxzero-app/SKILL.md",
    "project-instructions/AGENTS.md",
  ];

  for (const file of files) {
    const content = await readFile(path.join(root, file), "utf8");
    const selectCheck = content.indexOf("xcode-select -p");
    const receiptCheck = content.indexOf("pkgutil --pkg-info com.apple.pkg.CLTools_Executables");
    const install = content.indexOf("xcode-select --install");
    assert.ok(selectCheck >= 0, `${file} must check xcode-select without invoking Git`);
    assert.ok(receiptCheck > selectCheck, `${file} must check the CLT package receipt second`);
    assert.ok(install > receiptCheck, `${file} must install only after both non-Git checks`);
    assert.equal(content.match(/xcode-select --install/g)?.length, 1, `${file} must mention one install invocation`);
    assert.match(content.slice(install), /(?:stop|Stop)/, `${file} must stop at the Apple dialog`);
    assert.match(content, /(?:branch ZIP|mutable source)/, `${file} must reject a mutable Git bypass`);
  }

  const readme = await readFile(path.join(root, "README.md"), "utf8");
  assert.ok(readme.indexOf("xcode-select -p") < readme.indexOf("codex plugin marketplace add"));
  assert.doesNotMatch(readme, /archive\/refs\/heads\/main|main\.zip/);
});

test("Codex onboarding verifies installation and defers one activation boundary", async () => {
  const readme = await readFile(path.join(root, "README.md"), "utf8");
  const marketplace = readme.indexOf("codex plugin marketplace add fluxzero-io/fluxzero-agent-plugins");
  const install = readme.indexOf("codex plugin add fluxzero@fluxzero", marketplace);
  const list = readme.indexOf("codex plugin list --json", install);
  const readiness = readme.indexOf("### Verify readiness, then activate once", list);
  const relaunch = readme.indexOf("completely quit\nand relaunch Codex/ChatGPT", readiness);
  assert.ok(marketplace >= 0);
  assert.ok(install > marketplace);
  assert.ok(list > install);
  assert.ok(readiness > list);
  assert.ok(relaunch > readiness);
  assert.match(readme, /installed and enabled/);
  assert.match(readme, /A new task inside an already-running macOS Codex process is not enough/);
});

test("macOS onboarding proves persistent CLI and GUI process visibility", async () => {
  const readme = await readFile(path.join(root, "README.md"), "utf8");
  assert.match(readme, /env -i HOME="\$HOME" USER="\$USER" LOGNAME="\$LOGNAME" SHELL=\/bin\/zsh/);
  assert.match(readme, /\/bin\/zsh -l -c 'command -v fz && fz version && fz mcp --help'/);
  assert.ok(readme.includes("/bin/launchctl getenv PATH"));
  assert.ok(readme.includes("/bin/launchctl setenv PATH"));
  assert.match(readme, /affects only applications launched afterward/);
});

test("activation requires both MCP surfaces before application work", async () => {
  const files = [
    "README.md",
    "skills/build-fluxzero-app/SKILL.md",
    "project-instructions/AGENTS.md",
  ];
  for (const file of files) {
    const content = await readFile(path.join(root, file), "utf8");
    for (const instruction of ["fluxzero-docs", "docs_start", "fluxzero-dev"]) {
      assert.ok(content.includes(instruction), `${file} must require ${instruction}`);
    }
    assert.match(content, /(?:Do not|Never|never) (?:claim readiness|equate|substitute|bypass)/);
  }
});

test("the public onboarding prompt stays agent-neutral and two lines", async () => {
  const readme = await readFile(path.join(root, "README.md"), "utf8");
  const prompt = readme.match(/This minimal prompt is intentionally agent-neutral:\n\n```text\n([\s\S]*?)\n```/);
  assert.ok(prompt, "minimal prompt is missing");
  const lines = prompt[1].split("\n").filter(Boolean);
  assert.equal(lines.length, 2);
  assert.ok(lines[0].includes("https://plugins.fluxzero.io"));
  assert.doesNotMatch(prompt[1], /Codex|Claude|Cursor|Copilot|Gemini/);
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

test("canonical agent workflow follows startup through the early dev control plane", async () => {
  const content = await readFile(path.join(root, "skills/build-fluxzero-app/SKILL.md"), "utf8");
  assert.ok(content.includes("control plane can connect while"));
  assert.match(content, /call\s+`get_status`\s+immediately/);
  assert.match(content, /call\s+`get_active_problems`\s+immediately/);
  assert.match(content, /follow\s+`wait_for_change`/i);
  assert.match(content, /Do not wait for an MCP startup timeout/);
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
