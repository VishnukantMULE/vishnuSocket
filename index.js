const WebSocket = require('ws');
const connectDB = require('./db/database');
const express = require('express');
const http = require('http');

const register = require('./routes/auth/register');
const login = require('./routes/auth/login');

const app = express();
const server = http.createServer(app); 

app.use(express.json());

connectDB(); 

app.use('/auth', login);
app.use('/auth', register);

const PORT = process.env.PORT || 9000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established.');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
