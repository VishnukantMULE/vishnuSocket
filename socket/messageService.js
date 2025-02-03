const Message = require('../model/message');

// Save chat message to the database
async function saveMessage({ senderId, receiverId, message }) {
    try {
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            timestamp: new Date(),
        });
        await newMessage.save();
    } catch (error) {
        console.error('Error saving message:', error);
    }
}

// Get chat history between two users
async function getChatHistory(senderId, receiverId) {
    try {
        return await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        }).sort({ timestamp: 1 }); // Sort messages in chronological order
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return [];
    }
}

module.exports = { saveMessage, getChatHistory };
