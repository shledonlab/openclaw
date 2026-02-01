# Openclaw 安全模組

本目錄包含 Openclaw 專案的安全相關文檔和配置範例。

## 📚 文檔索引

### 🚀 快速開始
- **[快速設定指南](./QUICK_SETUP.md)** - 5 分鐘內啟用 Prompt Injection 防護
  - 適合：想要快速啟用基本防護的用戶
  - 包含：設定步驟、測試方法、疑難排解

### 🛡️ 深入了解
- **[Prompt Injection 防護機制](./prompt-injection-defense.md)** - 完整的防護機制說明
  - 適合：想要深入了解防護原理的開發者
  - 包含：現有機制、增強建議、測試案例、多層防護策略

### 📋 實作參考
- **[實作總結](./IMPLEMENTATION_SUMMARY.md)** - 已完成工作和下一步建議
  - 適合：專案維護者和貢獻者
  - 包含：完成清單、文件結構、檢查清單

### ⚙️ 配置範例
- **[安全配置範例](./openclaw.security-example.json)** - 完整的配置範例
  - 適合：需要配置參考的用戶
  - 包含：詳細註解、最佳實踐建議

---

## 🎯 我應該從哪裡開始？

### 如果您是新用戶
👉 從 **[快速設定指南](./QUICK_SETUP.md)** 開始

### 如果您想了解原理
👉 閱讀 **[Prompt Injection 防護機制](./prompt-injection-defense.md)**

### 如果您是開發者
👉 查看 **[實作總結](./IMPLEMENTATION_SUMMARY.md)**

### 如果您需要配置參考
👉 參考 **[安全配置範例](./openclaw.security-example.json)**

---

## 🔒 核心安全功能

### 1. Prompt Injection 防護
- ✅ 自動檢測可疑模式
- ✅ 安全邊界包裝
- ✅ 多層防護架構
- ✅ 信任用戶白名單

### 2. 權限控制
- ✅ 配置層級功能開關
- ✅ 禁用危險操作
- ✅ 細粒度權限管理

### 3. 審計與監控
- ✅ 安全事件日誌
- ✅ 嚴重性分級
- ✅ 可疑模式追蹤

---

## 📊 防護層級

```
用戶輸入
    ↓
[Layer 1] 輸入驗證與模式檢測
    ↓
[Layer 2] 安全包裝
    ↓
[Layer 3] 系統提示詞防護
    ↓
[Layer 4] 權限控制
    ↓
[Layer 5] 審計與監控
    ↓
AI 處理
```

---

## 🧪 測試

所有安全功能都有完整的測試覆蓋：

```bash
# 運行安全相關測試
npm test -- security

# 運行 Discord 訊息安全測試
npm test -- message-security
```

---

## 🆘 需要幫助？

### 常見問題
1. **Bot 不回應訊息** → 檢查安全包裝是否過於嚴格
2. **合法訊息被標記** → 調整檢測模式或添加到信任列表
3. **攻擊未被檢測** → 更新可疑模式列表

詳細疑難排解請參考 [快速設定指南](./QUICK_SETUP.md#疑難排解)

### 報告安全問題
如果您發現安全漏洞，請：
1. **不要**公開發布
2. 查看 [SECURITY.md](../../SECURITY.md)
3. 按照指引私下報告

---

## 🤝 貢獻

歡迎貢獻新的安全功能或改進：

1. Fork 專案
2. 創建功能分支
3. 添加測試
4. 更新文檔
5. 提交 Pull Request

---

## 📖 延伸閱讀

### 外部資源
- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [Anthropic Prompt Injection Guide](https://docs.anthropic.com/claude/docs/prompt-injection)
- [OpenAI Safety Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)

### 專案文檔
- [安全審核報告](../../SECURITY_AUDIT_REPORT.md)
- [安全政策](../../SECURITY.md)
- [貢獻指南](../../CONTRIBUTING.md)

---

## 📅 更新記錄

- **2026-02-01**: 初始版本
  - 創建 Prompt Injection 防護機制
  - 添加 Discord 訊息安全模組
  - 更新 SOUL.md 安全邊界
  - 編寫完整文檔和測試

---

**維護者**：Openclaw Security Team  
**最後更新**：2026-02-01
