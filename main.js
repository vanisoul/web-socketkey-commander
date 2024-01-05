const WebSocket = require('ws');
const robot = require("robotjs");

const webSocketUrl = process.env.WebSocketUrl ?? "ws://127.0.0.1"
const ws = new WebSocket(webSocketUrl); // 替換成您的 WebSocket 伺服器地址

ws.on('open', function open() {
    console.log('已連接到伺服器');
});

ws.on('message', function incoming(message) {
    console.log('從伺服器收到: %s', message);
    if (message.length === 1) {
        robot.keyTap(message)
    }
});

ws.on('close', function close() {
    console.log('連接已關閉');
});

ws.on('error', function error(error) {
    console.error('發生錯誤:', error);
});