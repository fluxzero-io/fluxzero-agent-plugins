// Optional source supplement and generated skill for each agent.
// Add a source path when an agent-specific workflow has been qualified.
export const agentSkills = [
  ["plugins/fluxzero/instructions.md", "plugins/fluxzero/skills/build-fluxzero-app/SKILL.md"],
  [null, "adapters/claude/fluxzero/skills/build-fluxzero-app/SKILL.md"],
  [null, "adapters/cursor/fluxzero/skills/build-fluxzero-app/SKILL.md"],
  [null, "adapters/copilot/fluxzero/skills/build-fluxzero-app/SKILL.md"],
  [null, "skills/build-fluxzero-app/SKILL.md"],
];

export function composeSkill(common, supplement) {
  return [common.trimEnd(), supplement.trim()].filter(Boolean).join("\n\n") + "\n";
}
