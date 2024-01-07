const WebSocket = require('ws');
const robot = require("robotjs");

const webSocketUrl = process.env.WebSocketUrl ?? "ws://127.0.0.1"

const reconnectInterval = 5000; // 重連間隔時間（毫秒）
const heartbeatInterval = 30000; // 心跳檢查間隔時間（毫秒）
const allowedKeys = ['enter', 'space', 'up', 'down', 'left', 'right'];
const allowedCombos = ['alt+tab', 'alt+f4'];

function consoleLog(msg) {
    // 加上時間
    const now = new Date();
    const time = now.toLocaleTimeString();
    consoleLog(`[${time}] ${msg}`);
}

function handleMouseControl(command) {
    const parts = command.split(':');
    const action = parts[0];
    const args = parts[1].split(',');

    switch (action) {
        case 'mouseMove':
            // 確保傳入了 x 和 y 坐標
            if (args.length === 2) {
                const x = parseInt(args[0], 10);
                const y = parseInt(args[1], 10);
                robot.moveMouse(x, y);
            }
            break;
        case 'mouseClick':
            // 按鈕參數應該是 "left", "right" 或 "middle"
            if (args.length === 1) {
                const button = args[0];
                robot.mouseClick(button);
            }
            break;
        case 'mouseScroll':
            // 確保傳入了 dx 和 dy 滾輪距離
            if (args.length === 2) {
                const dx = parseInt(args[0], 10);
                const dy = parseInt(args[1], 10);
                robot.scrollMouse(dx, dy);
            }
            break;
        default:
            consoleLog('未知的滑鼠操作: ' + action);
    }
}

function handleKeyboardCombo(command) {
    const parts = msg.split('+');
    if (allowedCombos.includes(command.toString()) && parts.length === 2) {
        robot.keyTap(parts[1], parts[0]);
    }
}

function handleSingleKey(key) {
    // 執行單鍵操作
    if (key.length === 1 || allowedKeys.includes(key)) {
        robot.keyTap(key);
    }
}

function connectWebSocket() {
    const ws = new WebSocket(webSocketUrl); // 替換成您的 WebSocket 伺服器地址
    let isAlive = false;

    ws.on('open', function open() {
        isAlive = true;
        consoleLog('已連接到伺服器');
    });

    ws.on("pong", function pong() {
        isAlive = true
        consoleLog('收到伺服器 pong')
    });

    ws.on('message', function incoming(message) {
        const msg = message.toString();
        consoleLog('從伺服器收到: %s', msg);
        // 處理組合鍵
        if (msg.startsWith("mouse")) {
            consoleLog('滑鼠操作');
            handleMouseControl(msg);
        } else if (msg.includes('+')) {
            consoleLog('組合鍵操作');
            handleKeyboardCombo(msg)
        } else {
            consoleLog('單鍵操作');
            handleSingleKey(msg)
        }
    });

    ws.on('close', function close() {
        consoleLog('連接已關閉');
        isAlive = false;
        setTimeout(connectWebSocket, reconnectInterval);
    });

    ws.on('error', function error(error) {
        console.error('發生錯誤:', error);
        isAlive = false;
    });


    // 每隔一定時間發送心跳消息
    const pingInterval = setInterval(() => {
        // 心跳檢查沒有收到響應，則嘗試重新連接
        if (!isAlive) {
            consoleLog('連接失效，嘗試重新連接...');
            ws.terminate();
            clearInterval(pingInterval);
            connectWebSocket();
        }

        // 目前連線中的改為未活動，並寄送通知
        if (ws.readyState === WebSocket.OPEN) {
            consoleLog('發送心跳消息...');
            isAlive = false;
            ws.ping(); // 發送心跳消息
        }
    }, heartbeatInterval);
}

connectWebSocket();