const WebSocket = require('ws');

const ALLOWED_KEY = '1234567'; // Only this key is allowed

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, req) => {
    const key = new URL(req.url, 'http://localhost').searchParams.get('key');

    if (key !== ALLOWED_KEY) {
        console.log('Connection rejected: Invalid key');
        ws.close(); 
        return;
    }

    console.log('Client connected with valid key');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        if(message=="close")
        {
            ws.close();
        }
        ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
