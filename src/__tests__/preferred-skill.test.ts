import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { applyPreferredSkillPrompt } from '../../node_modules/claude-to-im/src/lib/bridge/conversation-engine.js';

describe('applyPreferredSkillPrompt', () => {
  it('returns the original text when no skill is selected', () => {
    assert.equal(applyPreferredSkillPrompt('hello'), 'hello');
  });

  it('prepends a stable skill hint when a preferred skill exists', () => {
    const result = applyPreferredSkillPrompt('Fix the bug', 'pua');
    assert.match(result, /selected the "pua" skill/i);
    assert.match(result, /Use that skill for this request/i);
    assert.match(result, /User request:\nFix the bug$/);
  });
});
