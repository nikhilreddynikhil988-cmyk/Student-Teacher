import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TeacherDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [teacherId, setTeacherId] = useState(null);
    const [stats, setStats] = useState({ pending: 0, approved: 0, total: 0 });

    useEffect(() => {
        fetchTeacherProfile();
    }, []);

    useEffect(() => {
        if (teacherId) {
            fetchAppointments();
        }
    }, [teacherId]);

    const fetchTeacherProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = JSON.parse(atob(token.split('.')[1])).user.id;

            // Get all teachers and find the one matching current user
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            const res = await axios.get(`${API_URL}/api/teachers`);
            const teacher = res.data.find(t => t.userId._id === userId);
            if (teacher) {
                setTeacherId(teacher._id);
            }
        } catch (error) {
            console.error('Error fetching teacher profile:', error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            const res = await axios.get(`${API_URL}/api/appointments/teacher/${teacherId}`, {
                headers: { 'x-auth-token': token }
            });

            setAppointments(res.data);

            const pending = res.data.filter(apt => apt.status === 'pending').length;
            const approved = res.data.filter(apt => apt.status === 'approved').length;
            setStats({ pending, approved, total: res.data.length });
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleApprove = async (appointmentId) => {
        try {
            const token = localStorage.getItem('token');
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            await axios.put(
                `${API_URL}/api/appointments/${appointmentId}/approve`,
                {},
                { headers: { 'x-auth-token': token } }
            );
            alert('Appointment approved!');
            fetchAppointments();
        } catch (error) {
            console.error('Error approving appointment:', error);
            alert('Failed to approve appointment');
        }
    };

    const handleReject = async (appointmentId) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const token = localStorage.getItem('token');
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            await axios.put(
                `${API_URL}/api/appointments/${appointmentId}/reject`,
                { rejectionReason: reason },
                { headers: { 'x-auth-token': token } }
            );
            alert('Appointment rejected');
            fetchAppointments();
        } catch (error) {
            console.error('Error rejecting appointment:', error);
            alert('Failed to reject appointment');
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
            backgroundColor: '#fff',
        },
        statNumber: {
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#007bff',
        },
        statLabel: {
            color: '#666',
            marginTop: '5px',
        },
        appointmentCard: {
            padding: '20px',
            marginBottom: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: '#fff',
        },
        appointmentHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
        },
        studentName: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
        },
        statusBadge: {
            padding: '5px 15px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
        },
        appointmentDetails: {
            marginBottom: '10px',
            color: '#666',
        },
        buttonContainer: {
            display: 'flex',
            gap: '10px',
            marginTop: '15px',
        },
        approveButton: {
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        },
        rejectButton: {
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
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

    const pendingAppointments = appointments.filter(apt => apt.status === 'pending');

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Teacher Dashboard</h1>
                <p>Manage your appointments and student requests</p>
            </div>

            <div style={styles.statsContainer}>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats.pending}</div>
                    <div style={styles.statLabel}>Pending Requests</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats.approved}</div>
                    <div style={styles.statLabel}>Approved</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats.total}</div>
                    <div style={styles.statLabel}>Total Appointments</div>
                </div>
            </div>

            <h2>Pending Appointment Requests</h2>
            {pendingAppointments.length === 0 ? (
                <p>No pending requests</p>
            ) : (
                pendingAppointments.map(apt => (
                    <div key={apt._id} style={styles.appointmentCard}>
                        <div style={styles.appointmentHeader}>
                            <div style={styles.studentName}>{apt.student.name}</div>
                            <span style={getStatusStyle(apt.status)}>{apt.status.toUpperCase()}</span>
                        </div>
                        <div style={styles.appointmentDetails}>
                            <div><strong>Subject:</strong> {apt.subject}</div>
                            <div><strong>Date:</strong> {new Date(apt.date).toLocaleDateString()}</div>
                            <div><strong>Time:</strong> {apt.timeSlot.start} - {apt.timeSlot.end}</div>
                            <div><strong>Student Email:</strong> {apt.student.email}</div>
                            {apt.message && (
                                <div style={{ marginTop: '10px' }}>
                                    <strong>Message:</strong> {apt.message}
                                </div>
                            )}
                        </div>
                        <div style={styles.buttonContainer}>
                            <button
                                style={styles.approveButton}
                                onClick={() => handleApprove(apt._id)}
                            >
                                Approve
                            </button>
                            <button
                                style={styles.rejectButton}
                                onClick={() => handleReject(apt._id)}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))
            )}

            <h2 style={{ marginTop: '40px' }}>All Appointments</h2>
            {appointments.filter(apt => apt.status !== 'pending').map(apt => (
                <div key={apt._id} style={styles.appointmentCard}>
                    <div style={styles.appointmentHeader}>
                        <div style={styles.studentName}>{apt.student.name}</div>
                        <span style={getStatusStyle(apt.status)}>{apt.status.toUpperCase()}</span>
                    </div>
                    <div style={styles.appointmentDetails}>
                        <div><strong>Subject:</strong> {apt.subject}</div>
                        <div><strong>Date:</strong> {new Date(apt.date).toLocaleDateString()}</div>
                        <div><strong>Time:</strong> {apt.timeSlot.start} - {apt.timeSlot.end}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TeacherDashboard;
