const WebSocket = require('ws');
const { updateUserStatus, getActiveUsers, getUserbyID } = require('./userServices');
const clients = new Map(); // Stores active WebSocket clients

function initializeWebSocket(server) {
    console.log(require('./userServices'));
    const wss = new WebSocket.Server({ server });

    wss.on('connection', async (ws, req) => {
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const id = urlParams.get('key');

        if (!id) {
            ws.close(1008, 'id is required');
            return;
        }

        const user = await getUserbyID(id);
        if (!user) {
            ws.close(1008, 'Invalid id');
            return;
        }

        console.log(`User ${user._id} connected via id`);

        const socketId = generateSocketId();
        clients.set(user._id.toString(), { ws, socketId });

        await updateUserStatus(user._id.toString(), true, socketId);

        // Sending initial response as JSON with 'type' and 'data' structure
        const response = { 
            type: 'socket_assigned', 
            data: { socketId } 
        };
        ws.send(JSON.stringify(response));

        // Broadcast active users
        broadcastActiveUsers(wss);

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);

                if (data.type === 'user_connected' && data.userId === user._id.toString()) {
                    console.log(`User ${user._id} confirmed active`);
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });

        ws.on('close', async () => {
            if (clients.has(user._id.toString())) {
                clients.delete(user._id.toString());
                await updateUserStatus(user._id.toString(), false, null);
                console.log(`User ${user._id} disconnected.`);
                broadcastActiveUsers(wss);
            }
        });
    });

    return wss;
}

// Generate a unique socket ID
function generateSocketId() {
    return `socket_${Math.random().toString(36).substr(2, 9)}`;
}

// Broadcast active users to all clients
async function broadcastActiveUsers(wss) {
    try {
        const activeUsers = await getActiveUsers();
        const message = {
            type: 'active_users', 
            data: { users: activeUsers }  // Wrapping data in 'data' key
        };

        const activeUsersMessage = JSON.stringify(message);

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(activeUsersMessage);
            }
        });
    } catch (error) {
        console.error('Error broadcasting active users:', error);
    }
}

module.exports = initializeWebSocket;
