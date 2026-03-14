import { afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { listAvailableSkills } from '../../node_modules/claude-to-im/src/lib/bridge/bridge-manager.js';

const originalHome = process.env.HOME;
const tempDirs: string[] = [];

afterEach(() => {
  if (originalHome === undefined) {
    delete process.env.HOME;
  } else {
    process.env.HOME = originalHome;
  }
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

function writeSkill(root: string, relativeDir: string, name: string, description?: string) {
  const dir = path.join(root, relativeDir);
  fs.mkdirSync(dir, { recursive: true });
  const descriptionLine = description ? `description: "${description}"\n` : '';
  fs.writeFileSync(path.join(dir, 'SKILL.md'), `---\nname: ${name}\n${descriptionLine}---\n\n# ${name}\n`);
}

describe('listAvailableSkills', () => {
  it('lists Codex skills from the current home directory', () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'cti-skills-'));
    tempDirs.push(home);
    process.env.HOME = home;

    writeSkill(path.join(home, '.codex', 'skills'), 'pua', 'pua', 'push harder');
    writeSkill(path.join(home, '.codex', 'skills'), '.system/skill-installer', 'skill-installer');

    const skills = listAvailableSkills('codex');
    assert.deepEqual(skills.map(skill => skill.name), ['pua', 'skill-installer']);
    assert.equal(skills[0].source, 'codex');
    assert.equal(skills[0].description, 'push harder');
  });

  it('lists both Codex and Claude skills in auto runtime', () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'cti-skills-'));
    tempDirs.push(home);
    process.env.HOME = home;

    writeSkill(path.join(home, '.codex', 'skills'), 'pua', 'pua');
    writeSkill(path.join(home, '.claude', 'skills'), 'notebooklm', 'notebooklm');

    const skills = listAvailableSkills('auto');
    assert.deepEqual(
      skills.map(skill => `${skill.source}:${skill.name}`),
      ['claude:notebooklm', 'codex:pua'],
    );
  });
});
