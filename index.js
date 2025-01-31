const WebSocket = require('ws');

// Only this key is allowed
const ALLOWED_KEY = '1234567'; 

// Set the port dynamically (from the environment variable or default to 8080 for local development)
const PORT = process.env.PORT || 8080; 

// Get the WebSocket URL based on the environment (local or Render)
const SOCKET_URL = process.env.NODE_ENV === 'production'
    ? 'wss://vishnusocket.onrender.com' // Production WebSocket URL
    : `ws://localhost:${PORT}`; // Local WebSocket URL for development

// Configure WebSocket server
const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws, req) => {
    const key = new URL(req.url, `http://localhost:${PORT}`).searchParams.get('key');

    if (key !== ALLOWED_KEY) {
        console.log('Connection rejected: Invalid key');
        ws.close(); 
        return;
    }

    console.log('Client connected with valid key');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        if(message == "close") {
            ws.close();
        }
        ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log(`WebSocket server is running on ${SOCKET_URL}`);
