---
description: Discord 對話設定完整流程
---

# Discord 對話設定工作流程

## 前置準備

### 1. 建立 Discord Bot

1. 前往 [Discord Developer Portal](https://discord.com/developers/applications)
2. 點擊 **New Application**，輸入 Bot 名稱（例如：Clawdbot）
3. 在左側選單點擊 **Bot** → **Add Bot**
4. 複製 **Bot Token**（請妥善保管）

### 2. 啟用必要的 Intents

在 **Bot** → **Privileged Gateway Intents** 中啟用：
- ✅ **Message Content Intent**（必須）
- ✅ **Server Members Intent**（建議）

### 3. 產生邀請連結

在 **OAuth2** → **URL Generator** 中：

**Scopes**：
- ✅ `bot`
- ✅ `applications.commands`

**Bot Permissions**：
- ✅ View Channels
- ✅ Send Messages
- ✅ Read Message History
- ✅ Embed Links
- ✅ Attach Files
- ✅ Add Reactions

複製產生的 URL，在瀏覽器中開啟並邀請 Bot 到你的伺服器。

## 設定步驟

### 1. 設定 Discord Bot Token

編輯 `.env` 檔案，將你的 Bot Token 填入：

```bash
DISCORD_BOT_TOKEN=你的_discord_bot_token
```

### 2. 驗證設定檔

確認 `~/.openclaw/openclaw.json` 中已包含 Discord 設定（已自動新增）。

### 3. 啟動 Gateway

// turbo
```bash
cd /Users/clawdbot/Downloads/openclaw-main
pnpm gateway
```

### 4. 測試 DM 功能

1. 在 Discord 中向你的 Bot 發送私訊
2. Bot 會回覆一個配對碼（pairing code）
3. 在終端機中執行批准指令：

```bash
openclaw pairing approve discord <配對碼>
```

4. 再次發送訊息測試

### 5. 設定伺服器頻道（選用）

如果你想讓 Bot 在特定伺服器頻道中運作：

#### 5.1 取得 ID

在 Discord 中啟用開發者模式：
- **使用者設定** → **進階** → 啟用 **開發者模式**

然後右鍵點擊：
- 伺服器名稱 → **複製伺服器 ID**（Guild ID）
- 頻道名稱 → **複製頻道 ID**（Channel ID）
- 你的使用者 → **複製使用者 ID**（User ID）

#### 5.2 更新設定

編輯 `~/.openclaw/openclaw.json`，在 `channels.discord.guilds` 中新增：

```json
{
  "channels": {
    "discord": {
      "guilds": {
        "你的伺服器ID": {
          "requireMention": true,
          "users": ["你的使用者ID"],
          "channels": {
            "頻道ID": {
              "allow": true,
              "requireMention": true
            }
          }
        }
      }
    }
  }
}
```

#### 5.3 重啟 Gateway

```bash
# 按 Ctrl+C 停止 gateway
pnpm gateway
```

### 6. 測試伺服器頻道

在設定的頻道中提及（@mention）你的 Bot：

```
@Clawdbot 你好！
```

## 常見問題排查

### Bot 連線但不回應

1. 檢查是否啟用 **Message Content Intent**
2. 確認 Bot 有頻道的讀取/發送權限
3. 在伺服器頻道中必須 @mention Bot（預設設定）
4. 檢查頻道是否在 allowlist 中

### DM 無法使用

- 確認 `channels.discord.dm.enabled` 為 `true`
- 檢查 `dm.policy` 設定（預設為 `pairing`）
- 確認已批准配對碼

### 診斷指令

```bash
# 檢查系統狀態
openclaw doctor

# 檢查頻道狀態
openclaw channels status --probe

# 查看配對請求
openclaw pairing list
```

## 安全建議

1. **保護 Bot Token**：不要將 `.env` 檔案提交到 Git
2. **最小權限原則**：只給予 Bot 必要的權限
3. **使用配對模式**：DM 預設使用 `pairing` 政策，需要手動批准
4. **伺服器頻道需提及**：`requireMention: true` 避免 Bot 在所有訊息中回應

## 進階設定

### 允許特定使用者 DM（無需配對）

編輯 `openclaw.json`：

```json
{
  "channels": {
    "discord": {
      "dm": {
        "policy": "allowlist",
        "allowFrom": ["你的使用者ID", "其他使用者ID"]
      }
    }
  }
}
```

### 開放所有 DM（不建議）

```json
{
  "channels": {
    "discord": {
      "dm": {
        "policy": "open",
        "allowFrom": ["*"]
      }
    }
  }
}
```

### 停用 DM

```json
{
  "channels": {
    "discord": {
      "dm": {
        "enabled": false
      }
    }
  }
}
```

## 相關文件

- [Discord 官方文件](/Users/clawdbot/Downloads/openclaw-main/docs/channels/discord.md)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [OpenClaw 指令參考](/Users/clawdbot/Downloads/openclaw-main/docs/tools/slash-commands.md)
