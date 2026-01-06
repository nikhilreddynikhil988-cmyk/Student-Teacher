const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Send message
router.post('/', auth, async (req, res) => {
    const { receiver, content } = req.body;

    try {
        const message = new Message({
            sender: req.user.id,
            receiver,
            content
        });

        await message.save();

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name email')
            .populate('receiver', 'name email');

        res.json(populatedMessage);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get conversation with a user
router.get('/conversation/:userId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user.id }
            ]
        })
            .populate('sender', 'name email')
            .populate('receiver', 'name email')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all conversations for current user
router.get('/conversations', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id },
                { receiver: req.user.id }
            ]
        })
            .populate('sender', 'name email')
            .populate('receiver', 'name email')
            .sort({ createdAt: -1 });

        // Group by conversation partner
        const conversations = {};
        messages.forEach(msg => {
            const partnerId = msg.sender._id.toString() === req.user.id
                ? msg.receiver._id.toString()
                : msg.sender._id.toString();

            if (!conversations[partnerId]) {
                conversations[partnerId] = {
                    partner: msg.sender._id.toString() === req.user.id ? msg.receiver : msg.sender,
                    lastMessage: msg,
                    unreadCount: 0
                };
            }

            if (!msg.isRead && msg.receiver._id.toString() === req.user.id) {
                conversations[partnerId].unreadCount++;
            }
        });

        res.json(Object.values(conversations));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get unread message count
router.get('/unread', auth, async (req, res) => {
    try {
        const count = await Message.countDocuments({
            receiver: req.user.id,
            isRead: false
        });
        res.json({ count });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Mark message as read
router.put('/:id/read', auth, async (req, res) => {
    try {
        let message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ msg: 'Message not found' });
        }

        message.isRead = true;
        await message.save();
        res.json(message);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Mark all messages in conversation as read
router.put('/conversation/:userId/read', auth, async (req, res) => {
    try {
        await Message.updateMany(
            {
                sender: req.params.userId,
                receiver: req.user.id,
                isRead: false
            },
            { isRead: true }
        );
        res.json({ msg: 'Messages marked as read' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
