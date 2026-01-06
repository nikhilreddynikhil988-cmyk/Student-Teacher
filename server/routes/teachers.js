const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const User = require('../models/user');
const auth = require('../middleware/auth');

// Get all active teachers (public)
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find({ isActive: true }).populate('userId', 'name email');
        res.json(teachers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get teacher by ID
router.get('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id).populate('userId', 'name email');
        if (!teacher) {
            return res.status(404).json({ msg: 'Teacher not found' });
        }
        res.json(teacher);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Search teachers by subject
router.get('/search/:subject', async (req, res) => {
    try {
        const teachers = await Teacher.find({
            subject: new RegExp(req.params.subject, 'i'),
            isActive: true
        }).populate('userId', 'name email');
        res.json(teachers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create teacher profile (admin only)
router.post('/', auth, async (req, res) => {
    const { userId, subject, qualification, experience, bio, availability } = req.body;

    try {
        const adminUser = await User.findById(req.user.id);
        if (adminUser.role !== 'admin') {
            return res.status(401).json({ msg: 'Authorization denied' });
        }

        // Check if user exists and is a teacher
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.role !== 'teacher') {
            return res.status(400).json({ msg: 'User is not a teacher' });
        }

        // Check if teacher profile already exists
        let teacher = await Teacher.findOne({ userId });
        if (teacher) {
            return res.status(400).json({ msg: 'Teacher profile already exists' });
        }

        teacher = new Teacher({
            userId,
            subject,
            qualification,
            experience,
            bio,
            availability
        });

        await teacher.save();
        res.json(teacher);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update teacher profile
router.put('/:id', auth, async (req, res) => {
    const { subject, qualification, experience, bio, availability, isActive } = req.body;

    try {
        const user = await User.findById(req.user.id);
        let teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ msg: 'Teacher not found' });
        }

        if (user.role !== 'admin' && teacher.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Authorization denied' });
        }

        // Update fields
        if (subject) teacher.subject = subject;
        if (qualification) teacher.qualification = qualification;
        if (experience) teacher.experience = experience;
        if (bio) teacher.bio = bio;
        if (availability) teacher.availability = availability;
        if (typeof isActive !== 'undefined' && user.role === 'admin') {
             teacher.isActive = isActive;
        }


        await teacher.save();
        res.json(teacher);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete teacher (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(401).json({ msg: 'Authorization denied' });
        }
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ msg: 'Teacher not found' });
        }

        await Teacher.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Teacher removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
