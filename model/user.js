const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    isActive: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },
    socketId: { type: String, default: null },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
