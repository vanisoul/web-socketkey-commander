const WebSocket = require('ws');
const robot = require("robotjs");

const webSocketUrl = process.env.WebSocketUrl ?? "ws://127.0.0.1"


const reconnectInterval = 5000; // 重連間隔時間（毫秒）
const heartbeatInterval = 30000; // 心跳檢查間隔時間（毫秒）
const allowedKeys = ['enter', 'space', 'up', 'down', 'left', 'right'];
const allowedCombos = ['alt+tab', 'alt+f4'];

function connectWebSocket() {
    const ws = new WebSocket(webSocketUrl); // 替換成您的 WebSocket 伺服器地址
    let isAlive = false;

    ws.on('open', function open() {
        isAlive = true;
        console.log('已連接到伺服器');
    });

    ws.on("pong", function pong() {
        isAlive = true
        console.log('收到伺服器 pong')
    });

    ws.on('message', function incoming(message) {
        const msg = message.toString();
        console.log('從伺服器收到: %s', msg);
        // 處理組合鍵
        if (msg.includes('+') && allowedCombos.includes(msg.toString())) {
            const parts = msg.split('+');
            if (parts.length === 2) {
                robot.keyTap(parts[1], parts[0]);
            }
        } else {
            // 處理單一鍵
            if (msg.length === 1 || allowedKeys.includes(msg.toString())) {
                robot.keyTap(msg);
            }
        }
    });

    ws.on('close', function close() {
        console.log('連接已關閉');
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
            console.log('連接失效，嘗試重新連接...');
            ws.terminate();
            clearInterval(pingInterval);
            connectWebSocket();
        }

        // 目前連線中的改為未活動，並寄送通知
        if (ws.readyState === WebSocket.OPEN) {
            isAlive = false;
            ws.ping(); // 發送心跳消息
        }
    }, heartbeatInterval);
}

connectWebSocket();