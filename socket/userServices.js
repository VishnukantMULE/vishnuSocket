const User = require('../model/user');

// Update user status in the database
async function updateUserStatus(userId, isActive, socketId) {
    try {
        await User.findByIdAndUpdate(userId, {
            isActive,
            lastSeen: new Date(),
            socketId
        });
    } catch (error) {
        console.error('Error updating user status:', error);
    }
}

// Get active users from the database
async function getActiveUsers() {
    try {
        return await User.find({ isActive: true }, 'userName email lastSeen');
    } catch (error) {
        console.error('Error fetching active users:', error);
        return [];
    }
}

// Validate user using id
async function getUserbyID(id) {
    try {
        const user = await User.findOne({ _id: id }, '_id userName email');
        if (user) {
            console.log('User Name:', user.userName);
        }
        return user;
    } catch (error) {
        console.error('Error validating id:', error);
        return null;
    }
}

module.exports = { updateUserStatus, getActiveUsers, getUserbyID };