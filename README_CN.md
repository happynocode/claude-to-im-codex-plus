# Claude-to-IM Codex Plus

这是原始 Claude-to-IM skill 的增强分支，面向 Claude Code 和 Codex。

[English](README.md)

这个仓库保留了原来的多平台 IM 桥接能力，并加入了这次刚完成的 Discord / Codex 增强：

- 更强的 `/new` 会话创建参数
- Discord 内按聊天维度配置 sandbox / approval / web search
- 基于 `cc-switch` 的 provider 选择
- 在 Discord 里发现和固定 skill
- Codex 工作过程中的更透明进度提示

## 这个分支新增了什么

### Discord / Codex 体验增强

- `/new [path] -p provider -s sandbox -a approval --search`
- `/sandbox`、`/approval`、`/search`，支持 Discord 按钮选择
- `/providers`、`/use-provider`、`/current-provider`、`/clear-provider`
- `/skills`、`/use-skill`、`/current-skill`、`/clear-skill`
- Discord 中更主动的中间进度消息，包括 thinking / tool / todo / heartbeat 更新

### Provider 集成

- 从 `~/.cc-switch/cc-switch.db` 读取 Codex providers
- 允许按 provider 的 `id` 或 `name` 选择
- 为每个 provider 建立对应的 Codex SDK client，并带上匹配的 API key / base URL / model provider
- 当 `cc-switch` 不可用时，回退到 `~/.codex/config.toml`

## 核心能力

- 将 Claude Code 或 Codex 桥接到 Telegram、Discord、飞书 / Lark、QQ
- 守护进程重启后保留会话历史
- 把权限请求回传到聊天里处理
- 将流式输出实时发回 IM 客户端
- 本地配置自动脱敏，并使用安全文件权限保存

## 安装

### Codex

把这个分支作为原始 `claude-to-im` skill 的替代品，克隆到 Codex skills 目录：

```bash
git clone https://github.com/happynocode/claude-to-im-codex-plus.git ~/.codex/skills/claude-to-im
cd ~/.codex/skills/claude-to-im
npm install
npm run build
```

或者用仓库自带脚本：

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

## 快速演示

当 bridge 配好并启动后，Discord 里可以这样实际使用：

```text
/new /path/to/project -p default -s danger-full-access -a never --search
/providers
/use-provider default
/skills
/use-skill pua
/progress verbose
/sandbox
/approval on-request
/search live
帮我给这个仓库做一个 Discord 进度面板
```

这样你就能得到：

- 来自 `cc-switch` 的 provider 选择
- 按聊天固定的 skill
- Discord 里更透明的 Codex 进度提示

## Discord 命令示例

```text
/new /path/to/project -p default -s danger-full-access -a never --search
/providers
/use-provider default
/skills
/use-skill pua
/progress verbose
/sandbox
/approval on-request
/search live
```

## 开发

```bash
npm install
npm test
npm run build
```

上游 bridge 包固定在 commit `18c367379ef74587fe54f531538664a578a5f476`，本地行为修改记录在 `patches/claude-to-im+0.1.0.patch`。

## 致谢与引用

这个分支基于以下上游项目：

- 原始 skill 仓库：`https://github.com/op7418/Claude-to-IM-skill`
- 原始 bridge 包：`https://github.com/op7418/claude-to-im`
- 相关桌面应用：`https://github.com/op7418/CodePilot`

二次分发前请先查看 `LICENSE` 中的上游许可条款。
