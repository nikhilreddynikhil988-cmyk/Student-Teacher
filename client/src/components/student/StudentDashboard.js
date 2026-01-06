import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = JSON.parse(atob(token.split('.')[1])).user.id;

            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            const res = await axios.get(`${API_URL}/api/appointments/student/${userId}`, {
                headers: { 'x-auth-token': token }
            });

            setAppointments(res.data);

            // Calculate stats
            const pending = res.data.filter(apt => apt.status === 'pending').length;
            const approved = res.data.filter(apt => apt.status === 'approved').length;
            const rejected = res.data.filter(apt => apt.status === 'rejected').length;
            setStats({ pending, approved, rejected });
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const styles = {
        container: {
            padding: '20px',
            maxWidth: '1200px',
            margin: '80px auto 0',
        },
        header: {
            marginBottom: '30px',
        },
        statsContainer: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
        },
        statCard: {
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center',
        },
        pending: {
            backgroundColor: '#fff3cd',
            borderLeft: '4px solid #ffc107',
        },
        approved: {
            backgroundColor: '#d4edda',
            borderLeft: '4px solid #28a745',
        },
        rejected: {
            backgroundColor: '#f8d7da',
            borderLeft: '4px solid #dc3545',
        },
        statNumber: {
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '10px 0',
        },
        statLabel: {
            color: '#666',
            fontSize: '0.9rem',
        },
        buttonContainer: {
            display: 'flex',
            gap: '15px',
            marginBottom: '30px',
        },
        button: {
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
        },
        appointmentsList: {
            marginTop: '20px',
        },
        appointmentCard: {
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: '#fff',
        },
        appointmentHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
        },
        statusBadge: {
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
        },
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending':
                return { ...styles.statusBadge, backgroundColor: '#ffc107', color: '#000' };
            case 'approved':
                return { ...styles.statusBadge, backgroundColor: '#28a745', color: '#fff' };
            case 'rejected':
                return { ...styles.statusBadge, backgroundColor: '#dc3545', color: '#fff' };
            default:
                return styles.statusBadge;
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Student Dashboard</h1>
                <p>Welcome! Manage your appointments and connect with teachers.</p>
            </div>

            <div style={styles.statsContainer}>
                <div style={{ ...styles.statCard, ...styles.pending }}>
                    <div style={styles.statNumber}>{stats.pending}</div>
                    <div style={styles.statLabel}>Pending Appointments</div>
                </div>
                <div style={{ ...styles.statCard, ...styles.approved }}>
                    <div style={styles.statNumber}>{stats.approved}</div>
                    <div style={styles.statLabel}>Approved Appointments</div>
                </div>
                <div style={{ ...styles.statCard, ...styles.rejected }}>
                    <div style={styles.statNumber}>{stats.rejected}</div>
                    <div style={styles.statLabel}>Rejected Appointments</div>
                </div>
            </div>

            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={() => navigate('/student/teachers')}>
                    Browse Teachers
                </button>
                <button style={styles.button} onClick={() => navigate('/student/messages')}>
                    Messages
                </button>
            </div>

            <div style={styles.appointmentsList}>
                <h2>Recent Appointments</h2>
                {appointments.length === 0 ? (
                    <p>No appointments yet. Browse teachers to book your first appointment!</p>
                ) : (
                    appointments.slice(0, 5).map(apt => (
                        <div key={apt._id} style={styles.appointmentCard}>
                            <div style={styles.appointmentHeader}>
                                <div>
                                    <strong>{apt.teacher?.userId?.name || 'Teacher'}</strong>
                                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                                        {apt.subject}
                                    </div>
                                </div>
                                <span style={getStatusStyle(apt.status)}>
                                    {apt.status.toUpperCase()}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                Date: {new Date(apt.date).toLocaleDateString()} |
                                Time: {apt.timeSlot.start} - {apt.timeSlot.end}
                            </div>
                            {apt.rejectionReason && (
                                <div style={{ marginTop: '10px', color: '#dc3545', fontSize: '0.9rem' }}>
                                    Reason: {apt.rejectionReason}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default StudentDashboard;
