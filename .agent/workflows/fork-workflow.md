---
description: Fork workflow for managing personal modifications while syncing upstream updates
---

# OpenClaw Fork 工作流程

此工作流程適用於：修改 openclaw 代碼（如 SOUL.md）並同時保持與上游同步。

## 初始設定（只需執行一次）

### 1. Fork 官方倉庫

在 GitHub 上 fork `openclaw/openclaw` 到您的帳號。

### 2. 設定雙 Remote

```bash
# 添加 upstream（官方倉庫）
git remote add upstream https://github.com/openclaw/openclaw.git

# 修改 origin 指向您的 fork
# 替換 YOUR_USERNAME 為您的 GitHub 用戶名
git remote set-url origin https://github.com/YOUR_USERNAME/openclaw.git

# 驗證設定
git remote -v
```

應該看到：
```
origin    https://github.com/YOUR_USERNAME/openclaw.git (fetch)
origin    https://github.com/YOUR_USERNAME/openclaw.git (push)
upstream  https://github.com/openclaw/openclaw.git (fetch)
upstream  https://github.com/openclaw/openclaw.git (push)
```

### 3. 創建個人開發分支

```bash
# 為您的修改創建專門的分支
git checkout -b custom/soul-modifications

# 或者為不同的功能創建不同的分支
git checkout -b custom/feature-name
```

---

## 日常工作流程

### 📝 進行修改

```bash
# 確保在您的功能分支上
git checkout custom/soul-modifications

# 進行修改（例如編輯 SOUL.md）
# ... 編輯文件 ...

# 提交修改
git add docs/reference/templates/SOUL.md
git commit -m "feat: customize SOUL.md personality"

# 推送到您的 fork
git push origin custom/soul-modifications
```

### 🔄 同步上游更新

當官方倉庫有更新時：

```bash
# 1. 切換到 main 分支
git checkout main

# 2. 從上游拉取最新更新
git fetch upstream
git merge upstream/main
# 或使用 rebase: git rebase upstream/main

# 3. 推送更新到您的 fork
git push origin main

# 4. 將上游更新合併到您的功能分支
git checkout custom/soul-modifications
git merge main
# 或使用 rebase: git rebase main

# 5. 解決衝突（如果有）
# ... 解決衝突 ...
git add <resolved-files>
git commit  # 如果是 merge
# 或 git rebase --continue  # 如果是 rebase

# 6. 推送更新後的功能分支
git push origin custom/soul-modifications
```

### 🔀 處理衝突

如果您的修改與上游更新衝突（例如官方也修改了 SOUL.md）：

```bash
# 查看衝突文件
git status

# 編輯衝突文件，選擇保留的內容
# 衝突標記格式：
# <<<<<<< HEAD
# 您的修改
# =======
# 上游的修改
# >>>>>>> upstream/main

# 解決後標記為已解決
git add <resolved-files>

# 繼續合併/rebase
git commit  # 或 git rebase --continue
```

---

## 分支策略建議

### 方案 A：功能分支策略（推薦）

```
main (保持與 upstream/main 同步)
  ├── custom/soul-modifications (您的 SOUL.md 修改)
  ├── custom/config-tweaks (配置調整)
  └── custom/feature-x (其他功能)
```

**優點**：
- main 分支始終乾淨，易於同步
- 不同修改隔離，易於管理
- 可以選擇性地合併某些修改

**工作流程**：
```bash
# 同步上游
git checkout main
git pull upstream main
git push origin main

# 更新您的功能分支
git checkout custom/soul-modifications
git rebase main  # 或 git merge main
git push origin custom/soul-modifications --force-with-lease  # 如果用了 rebase
```

### 方案 B：直接在 main 修改（簡單但不推薦）

```
main (包含您的修改 + 上游更新)
```

**優點**：簡單直接

**缺點**：
- 難以區分哪些是您的修改
- 同步上游時容易產生衝突
- 無法選擇性地啟用/禁用某些修改

---

## 快速命令參考

### 檢查狀態

```bash
# 查看當前分支
git branch

# 查看與上游的差異
git fetch upstream
git log --oneline main..upstream/main  # 上游新增的 commits
git log --oneline upstream/main..main  # 您新增的 commits

# 查看修改的文件
git status
git diff
```

### 同步上游（快速版）

```bash
# 更新 main 分支
git checkout main && git pull upstream main && git push origin main

# 更新功能分支
git checkout custom/soul-modifications && git rebase main && git push --force-with-lease
```

### 備份當前工作

```bash
# 暫存當前修改
git stash save "WIP: description"

# 恢復暫存的修改
git stash pop

# 查看暫存列表
git stash list
```

---

## 進階技巧

### 1. 使用 Git Worktree（同時處理多個分支）

```bash
# 創建新的工作目錄
git worktree add ../openclaw-custom custom/soul-modifications

# 現在您可以在兩個目錄中同時工作
# /Users/clawdbot/Downloads/openclaw-main (main 分支)
# /Users/clawdbot/Downloads/openclaw-custom (custom/soul-modifications 分支)
```

### 2. 自動化同步腳本

創建 `scripts/sync-fork.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail

CUSTOM_BRANCH="${1:-custom/soul-modifications}"

echo "🔄 Syncing fork with upstream..."

# 更新 main
git checkout main
git fetch upstream
git merge upstream/main --no-edit
git push origin main

# 更新功能分支
git checkout "$CUSTOM_BRANCH"
git rebase main

echo "✅ Sync complete!"
echo "📝 Review changes and run: git push origin $CUSTOM_BRANCH --force-with-lease"
```

使用方式：
```bash
chmod +x scripts/sync-fork.sh
./scripts/sync-fork.sh custom/soul-modifications
```

### 3. 查看您的所有自定義修改

```bash
# 列出您在功能分支上的所有 commits
git log main..custom/soul-modifications --oneline

# 查看具體的修改內容
git diff main...custom/soul-modifications
```

---

## 常見問題

### Q: 我應該用 merge 還是 rebase？

**Merge**：
- 保留完整歷史
- 適合多人協作的分支
- 產生 merge commit

**Rebase**：
- 線性歷史，更清晰
- 適合個人功能分支
- 需要 force push

**建議**：
- main 分支同步上游：用 **merge**
- 功能分支更新：用 **rebase**

### Q: 如何撤銷錯誤的操作？

```bash
# 查看操作歷史
git reflog

# 回到之前的狀態
git reset --hard HEAD@{n}  # n 是 reflog 中的編號
```

### Q: 如何貢獻回官方倉庫？

```bash
# 1. 確保功能分支是基於最新的 upstream/main
git checkout custom/soul-modifications
git rebase main

# 2. 推送到您的 fork
git push origin custom/soul-modifications

# 3. 在 GitHub 上創建 Pull Request
# 從 YOUR_USERNAME/openclaw:custom/soul-modifications
# 到 openclaw/openclaw:main
```

---

## 檢查清單

### ✅ 初始設定
- [ ] Fork 官方倉庫到 GitHub
- [ ] 設定 upstream remote
- [ ] 修改 origin 指向您的 fork
- [ ] 創建功能分支

### ✅ 每次修改前
- [ ] 確認在正確的分支上
- [ ] 同步最新的上游更新
- [ ] 工作區是乾淨的（git status）

### ✅ 每次修改後
- [ ] 提交有意義的 commit message
- [ ] 推送到您的 fork
- [ ] （可選）創建 PR 貢獻回官方

### ✅ 定期維護
- [ ] 每週同步一次上游更新
- [ ] 清理已合併的分支
- [ ] 備份重要的修改
