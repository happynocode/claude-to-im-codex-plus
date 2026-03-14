# Claude-to-IM Codex Plus

An enhanced fork of the original Claude-to-IM skill for Claude Code and Codex.

[中文文档](README_CN.md)

This repository keeps the original multi-platform IM bridge workflow, then adds the Discord and Codex improvements we just built:

- richer `/new` session creation flags for Codex
- per-chat sandbox / approval / web search controls in Discord
- provider selection backed by `cc-switch`
- skill discovery and skill pinning from Discord
- clearer progress transparency while Codex is still working

## What This Fork Adds

### Discord / Codex quality-of-life

- `/new [path] -p provider -s sandbox -a approval --search`
- `/sandbox`, `/approval`, `/search` with clickable Discord buttons
- `/providers`, `/use-provider`, `/current-provider`, `/clear-provider`
- `/skills`, `/use-skill`, `/current-skill`, `/clear-skill`
- better intermediate progress messages in Discord, including thinking / tool / todo / heartbeat updates

### Provider integration

- reads Codex providers from `~/.cc-switch/cc-switch.db`
- supports selecting a provider by either provider `id` or `name`
- creates provider-specific Codex SDK clients with the matching API key / base URL / model provider
- falls back to `~/.codex/config.toml` if `cc-switch` data is unavailable

## Core Features

- Bridge Claude Code or Codex to Telegram, Discord, Feishu/Lark, and QQ
- Keep session history across daemon restarts
- Forward permission requests back into chat
- Stream partial responses back to IM clients
- Store local config with secret masking and safe file permissions

## Install

### Codex

Clone this fork into your Codex skill directory as a replacement for the original `claude-to-im` skill:

```bash
git clone https://github.com/happynocode/claude-to-im-codex-plus.git ~/.codex/skills/claude-to-im
cd ~/.codex/skills/claude-to-im
npm install
npm run build
```

Or use the included helper:

```bash
git clone https://github.com/happynocode/claude-to-im-codex-plus.git ~/code/claude-to-im-codex-plus
bash ~/code/claude-to-im-codex-plus/scripts/install-codex.sh
```

### Claude Code

```bash
git clone https://github.com/happynocode/claude-to-im-codex-plus.git ~/.claude/skills/claude-to-im
cd ~/.claude/skills/claude-to-im
npm install
npm run build
```

## Example Discord Commands

```text
/new /path/to/project -p default -s danger-full-access -a never --search
/providers
/use-provider default
/skills
/use-skill pua
/sandbox
/approval on-request
/search live
```

## Development

```bash
npm install
npm test
npm run build
```

The upstream bridge package is pinned to commit `18c367379ef74587fe54f531538664a578a5f476`, and local behavior changes are tracked in `patches/claude-to-im+0.1.0.patch`.

## Attribution

This fork builds on the original upstream work:

- Original skill repo: `https://github.com/op7418/Claude-to-IM-skill`
- Original bridge package: `https://github.com/op7418/claude-to-im`
- Related desktop app: `https://github.com/op7418/CodePilot`

Please review the upstream license terms in `LICENSE` before redistributing further.
