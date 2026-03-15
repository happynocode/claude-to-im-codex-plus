import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { markdownToDiscordChunks } from '../../node_modules/claude-to-im/src/lib/bridge/markdown/discord.js';

describe('markdownToDiscordChunks', () => {
  it('keeps short replies in one chunk', () => {
    const chunks = markdownToDiscordChunks('Short reply.');
    assert.equal(chunks.length, 1);
    assert.equal(chunks[0].text, 'Short reply.');
  });

  it('splits long multi-paragraph replies into multiple readable chunks', () => {
    const paragraph = 'This is a readable paragraph with enough detail to simulate a real assistant response. '.repeat(12).trim();
    const markdown = `## Summary\n\n${paragraph}\n\n## Details\n\n${paragraph}\n\n## Next Steps\n\n- Step one\n- Step two\n- Step three`;
    const chunks = markdownToDiscordChunks(markdown, 2000);
    assert.ok(chunks.length >= 2);
    assert.ok(chunks.every(chunk => chunk.text.length <= 2000));
    assert.ok(chunks[0].text.includes('## Summary'));
  });

  it('repairs fenced code blocks across chunk boundaries', () => {
    const code = ['```ts', ...Array.from({ length: 300 }, (_, i) => `const value${i} = ${i};`), '```'].join('\n');
    const chunks = markdownToDiscordChunks(code, 800);
    assert.ok(chunks.length >= 2);
    assert.ok(chunks.every(chunk => chunk.text.length <= 800));
    assert.ok(chunks[0].text.includes('```ts'));
  });
});
