import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  NEW_SESSION_COMMAND_USAGE,
  parseApprovalPolicyOverride,
  parseNewSessionCommandArgs,
  parseSandboxOverride,
  parseWebSearchModeOverride,
} from '../../node_modules/claude-to-im/src/lib/bridge/security/validators.js';

describe('parseNewSessionCommandArgs', () => {
  it('parses path and Codex overrides', () => {
    const parsed = parseNewSessionCommandArgs('/workspace/demo-project --search -s danger-full-access -a never -p yunyi');

    assert.equal(parsed.error, undefined);
    assert.deepEqual(parsed.options, {
      workingDirectory: '/workspace/demo-project',
      providerId: 'yunyi',
      webSearchMode: 'live',
      sandboxMode: 'danger-full-access',
      approvalPolicy: 'never',
    });
  });

  it('supports quoted paths and explicit search modes', () => {
    const parsed = parseNewSessionCommandArgs('"/workspace/my repo" --search cached');

    assert.equal(parsed.error, undefined);
    assert.deepEqual(parsed.options, {
      workingDirectory: '/workspace/my repo',
      webSearchMode: 'cached',
    });
  });

  it('rejects unknown flags with a stable usage string', () => {
    const parsed = parseNewSessionCommandArgs('/workspace/demo-project --wat');

    assert.equal(parsed.error, 'Unknown option: --wat');
    assert.match(NEW_SESSION_COMMAND_USAGE, /^Usage: \/new /);
  });
});

describe('setting override parsers', () => {
  it('parses sandbox value and default reset', () => {
    assert.deepEqual(parseSandboxOverride('danger-full-access'), { value: 'danger-full-access' });
    assert.deepEqual(parseSandboxOverride('default'), { clear: true });
  });

  it('parses approval policy value and default reset', () => {
    assert.deepEqual(parseApprovalPolicyOverride('never'), { value: 'never' });
    assert.deepEqual(parseApprovalPolicyOverride('default'), { clear: true });
  });

  it('parses search value and rejects invalid choice', () => {
    assert.deepEqual(parseWebSearchModeOverride('cached'), { value: 'cached' });
    assert.equal(parseWebSearchModeOverride('banana').error, 'Invalid search mode: banana');
  });
});
