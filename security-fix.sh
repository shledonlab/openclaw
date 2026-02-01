#!/bin/bash
# Openclaw 安全修復腳本
# 基於 https://securemyclawdbot.com/security/ 的建議

echo "🔒 Openclaw 安全修復腳本"
echo "================================"
echo ""

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 修復 .env 文件權限
echo "📝 步驟 1: 檢查並修復 .env 文件權限"
ENV_FILE="/Users/clawdbot/Downloads/openclaw-main/.env"

if [ -f "$ENV_FILE" ]; then
    CURRENT_PERM=$(stat -f "%Lp" "$ENV_FILE")
    echo "   當前權限: $CURRENT_PERM"
    
    if [ "$CURRENT_PERM" != "600" ]; then
        echo -e "   ${YELLOW}⚠️  權限不安全，正在修復...${NC}"
        chmod 600 "$ENV_FILE"
        NEW_PERM=$(stat -f "%Lp" "$ENV_FILE")
        echo -e "   ${GREEN}✅ 已更新權限: $NEW_PERM${NC}"
    else
        echo -e "   ${GREEN}✅ 權限已正確設置${NC}"
    fi
else
    echo -e "   ${RED}❌ 找不到 .env 文件${NC}"
fi

echo ""

# 2. 生成強 Gateway Token
echo "🔑 步驟 2: 生成強 Gateway 認證 Token"
NEW_TOKEN=$(openssl rand -base64 32)
echo "   新的 Token: $NEW_TOKEN"
echo ""
echo -e "   ${YELLOW}⚠️  請手動更新以下文件:${NC}"
echo "   文件: ~/.openclaw/openclaw.json"
echo "   路徑: gateway.auth.token"
echo "   新值: \"$NEW_TOKEN\""
echo ""

# 3. 檢查 .gitignore
echo "📋 步驟 3: 檢查 .gitignore 配置"
GITIGNORE_FILE="/Users/clawdbot/Downloads/openclaw-main/.gitignore"

if grep -q "^\.env$" "$GITIGNORE_FILE" 2>/dev/null; then
    echo -e "   ${GREEN}✅ .env 已在 .gitignore 中${NC}"
else
    echo -e "   ${RED}❌ .env 不在 .gitignore 中${NC}"
fi

echo ""

# 4. 檢查 macOS 防火牆
echo "🛡️  步驟 4: 檢查 macOS 防火牆狀態"
FIREWALL_STATUS=$(sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate 2>/dev/null)
echo "   $FIREWALL_STATUS"

if echo "$FIREWALL_STATUS" | grep -q "enabled"; then
    echo -e "   ${GREEN}✅ 防火牆已啟用${NC}"
else
    echo -e "   ${YELLOW}⚠️  防火牆未啟用${NC}"
    echo "   建議執行: sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on"
fi

echo ""

# 5. 檢查 Gateway 綁定
echo "🌐 步驟 5: 檢查 Gateway 綁定狀態"
if lsof -i :18789 2>/dev/null | grep -q "localhost"; then
    echo -e "   ${GREEN}✅ Gateway 正確綁定到 localhost${NC}"
    lsof -i :18789 | grep LISTEN
else
    echo -e "   ${YELLOW}⚠️  Gateway 未運行或未綁定到 18789 端口${NC}"
fi

echo ""

# 6. 檢查配置文件權限
echo "🔐 步驟 6: 檢查配置文件權限"
CONFIG_FILE="$HOME/.openclaw/openclaw.json"

if [ -f "$CONFIG_FILE" ]; then
    CONFIG_PERM=$(stat -f "%Lp" "$CONFIG_FILE")
    echo "   openclaw.json 權限: $CONFIG_PERM"
    
    if [ "$CONFIG_PERM" = "600" ]; then
        echo -e "   ${GREEN}✅ 權限正確${NC}"
    else
        echo -e "   ${YELLOW}⚠️  建議設置為 600${NC}"
        echo "   執行: chmod 600 $CONFIG_FILE"
    fi
else
    echo -e "   ${RED}❌ 找不到 openclaw.json${NC}"
fi

echo ""

# 7. 安全建議摘要
echo "================================"
echo "📊 安全建議摘要"
echo "================================"
echo ""
echo "✅ 已自動修復:"
echo "   - .env 文件權限設置為 600"
echo ""
echo "⚠️  需要手動操作:"
echo "   1. 更新 Gateway Token (見上方生成的 Token)"
echo "   2. 從 openclaw.json 移除硬編碼的 API 密鑰和 Discord Token"
echo "   3. 確保這些密鑰僅存在於 .env 文件中"
echo "   4. 考慮啟用 macOS 防火牆"
echo ""
echo "📖 完整報告:"
echo "   查看 SECURITY_AUDIT_REPORT.md 了解詳細信息"
echo ""
echo "🔗 安全審核工具:"
echo "   https://securemyclawdbot.com/security/"
echo ""
