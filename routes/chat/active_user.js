const express = require('express');
const User = require('../../model/user');
const router = express.Router();

router.get('/active_users', async (req, res) => {
    try {
        const activeUsers = await User.find({ isActive: true }, 'userName email lastSeen');
        res.json(activeUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching active users' });
    }
});

module.exports = router;
