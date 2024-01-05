# WebSocket 鍵盤控制器

此專案接收來自 WebSocket 的訊息，並使用這些訊息來控制鍵盤按鍵。它使用 Node.js 來處理 WebSocket 通信，並使用 Python 腳本來實現鍵盤操作。

## 開始使用

這些指示將幫助您在本地機器上獲得專案的副本，並運行起來以進行開發和測試。

### 先決條件

在開始之前，您需要安裝以下軟件：

- Node.js
- yarn
- Python 3.10
- node-gyp

您可以使用以下命令安裝這些依賴項：

```bash
# 安裝 Node.js 和 yarn
# 請根據您的操作系統訪問 https://nodejs.org/ 和 https://yarnpkg.com/ 來獲得安裝指南

# 使用 winget 安裝 Python 3.10 (僅限 Windows)
winget install -e --id Python.Python.3.10

# 安裝 node-gyp
npm install -g node-gyp
```