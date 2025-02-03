const WebSocket = require('ws');
const { updateUserStatus, getActiveUsers, getUserbyID } = require('./userServices');
const { saveMessage, getChatHistory } = require('./messageService');

const clients = new Map();

function initializeWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', async (ws, req) => {
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const userId = urlParams.get('key');

        if (!userId) {
            ws.close(1008, 'id is required');
            return;
        }

        const user = await getUserbyID(userId);
        if (!user) {
            ws.close(1008, 'Invalid id');
            return;
        }

        console.log(`User ${user._id} connected.`);
        const socketId = generateSocketId();
        clients.set(user._id.toString(), { ws, socketId });

        await updateUserStatus(user._id.toString(), true, socketId);

        // Send socket assigned event
        ws.send(JSON.stringify({ type: 'socket_assigned', data: { socketId } }));

        // Broadcast active users to all clients
        await broadcastActiveUsers();

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                
                if (data.type === 'chat_message') {
                    await handleMessage(user._id.toString(), data);
                } else if (data.type === 'fetch_chat_history') {
                    const messages = await getChatHistory(data.senderId, data.receiverId);
                    ws.send(JSON.stringify({ type: 'chat_history', data: messages }));
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });

        ws.on('close', async () => {
            clients.delete(user._id.toString());
            await updateUserStatus(user._id.toString(), false, null);
            console.log(`User ${user._id} disconnected.`);

            // Broadcast active users after disconnection
            await broadcastActiveUsers();
        });
    });

    return wss;
}

// Broadcast active users to all clients
async function broadcastActiveUsers() {
    const activeUsers = await getActiveUsers();
    const message = JSON.stringify({ type: 'active_users', data: activeUsers });

    clients.forEach(({ ws }) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        }
    });
}

// Handle incoming messages
async function handleMessage(senderId, data) {
    const { receiverId, message } = data;

    if (!receiverId || !message) return;

    const msgObj = {
        senderId,
        receiverId,
        message,
        timestamp: new Date(),
    };

    await saveMessage(msgObj);
    sendMessageToUser(receiverId, msgObj);
}

// Send message to a specific user
function sendMessageToUser(receiverId, message) {
    const receiver = clients.get(receiverId);
    if (receiver && receiver.ws.readyState === WebSocket.OPEN) {
        receiver.ws.send(JSON.stringify({ type: 'chat_message', data: message }));
    }
}

// Generate unique socket ID
function generateSocketId() {
    return `socket_${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = initializeWebSocket;
