import { afterEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { JsonFileStore } from '../store.js';

const originalHome = process.env.HOME;
const tempHomes: string[] = [];

function makeSettings(): Map<string, string> {
  return new Map([
    ['bridge_default_work_dir', '/tmp/test-cwd'],
    ['bridge_default_mode', 'code'],
  ]);
}

afterEach(() => {
  if (originalHome === undefined) {
    delete process.env.HOME;
  } else {
    process.env.HOME = originalHome;
  }
  for (const home of tempHomes.splice(0)) {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

describe('Codex provider config loading', () => {
  it('loads providers and default provider from ~/.cc-switch/cc-switch.db', () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'cti-provider-'));
    tempHomes.push(home);
    process.env.HOME = home;

    const ccSwitchDir = path.join(home, '.cc-switch');
    fs.mkdirSync(ccSwitchDir, { recursive: true });
    const dbPath = path.join(ccSwitchDir, 'cc-switch.db');
    fs.writeFileSync(path.join(ccSwitchDir, 'schema.sql'), '');
    const configPayload = JSON.stringify({
      auth: { OPENAI_API_KEY: 'token-alt', auth_mode: 'apikey' },
      config: 'model_provider = "yunyi"\n\n[model_providers.yunyi]\nbase_url = "https://example.com/codex"\n',
    });
    const configPayload2 = JSON.stringify({
      auth: { OPENAI_API_KEY: 'token-yunyi', auth_mode: 'apikey' },
      config: 'model_provider = "yunyi"\n\n[model_providers.yunyi]\nbase_url = "https://yunyi.cfd/codex"\n',
    });
    const sql = [
      'create table providers (id text not null, app_type text not null, name text not null, settings_config text not null, website_url text, category text, created_at integer, sort_index integer, notes text, icon text, icon_color text, meta text not null default "{}", is_current boolean not null default 0, in_failover_queue boolean not null default 0, cost_multiplier text not null default "1.0", limit_daily_usd text, limit_monthly_usd text, provider_type text, primary key (id, app_type));',
      `insert into providers (id, app_type, name, settings_config, is_current) values ('yunyi-a', 'codex', 'yunyi-a', '${configPayload.replace(/'/g, "''")}', 1);`,
      `insert into providers (id, app_type, name, settings_config, is_current) values ('alt', 'codex', 'alt', '${configPayload2.replace(/'/g, "''")}', 0);`,
    ].join(' ');
    execFileSync('sqlite3', [dbPath, sql]);

    const store = new JsonFileStore(makeSettings());
    assert.equal(store.getDefaultProviderId(), 'yunyi-a');
    assert.deepEqual(store.listProviders().map(provider => provider.id), ['alt', 'yunyi-a']);
    assert.equal(store.getProvider('alt')?.baseUrl, 'https://yunyi.cfd/codex');
    assert.equal(store.getProvider('yunyi-a')?.apiKey, 'token-alt');
  });
});
