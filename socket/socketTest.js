// socket/socket.js (debug version)
const WebSocket = require('ws');

function initializeWebSocket(server) {
    const wss = new WebSocket.Server({ server });
    console.log('✅ WebSocket server initialized');

    wss.on('connection', (ws, req) => {
        console.log('🔌 New client connected');
        const params = new URLSearchParams(req.url.split('?')[1]);
        const userId = params.get('key');
        
        if (!userId) {
            console.log('❌ No user ID provided');
            return ws.close();
        }

        console.log(`⚡ User ${userId} connected`);
        
        ws.on('message', (message) => {
            console.log(`📨 Received message from ${userId}: ${message}`);
            ws.send(`Echo: ${message}`);
        });

        ws.on('close', () => {
            console.log(`❎ User ${userId} disconnected`);
        });
    });

    return wss;
}

module.exports = initializeWebSocket;