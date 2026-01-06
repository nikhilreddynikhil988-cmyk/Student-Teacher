const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Teacher = require('../models/Teacher');
const auth = require('../middleware/auth');

// Create appointment (student)
router.post('/', auth, async (req, res) => {
    const { teacher, date, timeSlot, subject, message } = req.body;

    try {
        const appointment = new Appointment({
            student: req.user.id,
            teacher,
            date,
            timeSlot,
            subject,
            message
        });

        await appointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get student's appointments
router.get('/student/:id', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ student: req.params.id })
            .populate('teacher')
            .populate({
                path: 'teacher',
                populate: {
                    path: 'userId',
                    select: 'name email'
                }
            })
            .sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get teacher's appointments
router.get('/teacher/:teacherId', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ teacher: req.params.teacherId })
            .populate('student', 'name email')
            .sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all appointments (admin)
router.get('/', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('student', 'name email')
            .populate({
                path: 'teacher',
                populate: {
                    path: 'userId',
                    select: 'name email'
                }
            })
            .sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Approve appointment (teacher)
router.put('/:id/approve', auth, async (req, res) => {
    try {
        let appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        appointment.status = 'approved';
        appointment.updatedAt = Date.now();
        await appointment.save();

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Reject appointment (teacher)
router.put('/:id/reject', auth, async (req, res) => {
    const { rejectionReason } = req.body;

    try {
        let appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        appointment.status = 'rejected';
        appointment.rejectionReason = rejectionReason || 'No reason provided';
        appointment.updatedAt = Date.now();
        await appointment.save();

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete appointment
router.delete('/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Appointment removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
