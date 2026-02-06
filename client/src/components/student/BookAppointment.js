import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function BookAppointment() {
    const { teacherId } = useParams();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        timeSlot: { start: '', end: '' },
        subject: '',
        message: ''
    });

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
                const res = await axios.get(`${API_URL}/api/teachers/${teacherId}`);
                setTeacher(res.data);
                setFormData(prevFormData => ({ ...prevFormData, subject: res.data.subject }));
            } catch (error) {
                console.error('Error fetching teacher:', error);
            }
        };
        fetchTeacher();
    }, [teacherId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startTime' || name === 'endTime') {
            setFormData({
                ...formData,
                timeSlot: {
                    ...formData.timeSlot,
                    [name === 'startTime' ? 'start' : 'end']: value
                }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            await axios.post(
                `${API_URL}/api/appointments`,
                {
                    teacher: teacherId,
                    date: formData.date,
                    timeSlot: formData.timeSlot,
                    subject: formData.subject,
                    message: formData.message
                },
                {
                    headers: { 'x-auth-token': token }
                }
            );
            alert('Appointment request sent successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book appointment. Please try again.');
        }
    };

    const styles = {
        container: {
            padding: '20px',
            maxWidth: '600px',
            margin: '80px auto 0',
        },
        card: {
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: '#fff',
        },
        header: {
            marginBottom: '20px',
        },
        teacherInfo: {
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            marginBottom: '20px',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
        },
        label: {
            fontWeight: 'bold',
            marginBottom: '5px',
        },
        input: {
            padding: '10px',
            fontSize: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
        },
        textarea: {
            padding: '10px',
            fontSize: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            minHeight: '100px',
            resize: 'vertical',
        },
        timeSlotContainer: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
        },
        button: {
            padding: '12px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '10px',
        },
        backButton: {
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px',
        },
    };

    if (!teacher) return <div style={styles.container}>Loading...</div>;

    return (
        <div style={styles.container}>
            <button style={styles.backButton} onClick={() => navigate('/student/teachers')}>
                ← Back to Teachers
            </button>

            <div style={styles.card}>
                <div style={styles.header}>
                    <h1>Book Appointment</h1>
                </div>

                <div style={styles.teacherInfo}>
                    <h3>{teacher.userId.name}</h3>
                    <p><strong>Subject:</strong> {teacher.subject}</p>
                    <p><strong>Qualification:</strong> {teacher.qualification}</p>
                    <p><strong>Experience:</strong> {teacher.experience} years</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div>
                        <label style={styles.label}>Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            style={styles.input}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    <div>
                        <label style={styles.label}>Time Slot</label>
                        <div style={styles.timeSlotContainer}>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.timeSlot.start}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                            <input
                                type="time"
                                name="endTime"
                                value={formData.timeSlot.end}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={styles.label}>Subject/Topic</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div>
                        <label style={styles.label}>Message (Optional)</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Add any additional details or questions..."
                            style={styles.textarea}
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        Send Appointment Request
                    </button>
                </form>
            </div>
        </div>
    );
}

export default BookAppointment;
