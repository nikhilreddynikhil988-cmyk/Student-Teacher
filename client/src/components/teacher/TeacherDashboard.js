import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TeacherDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [teacherId, setTeacherId] = useState(null);
    const [stats, setStats] = useState({ pending: 0, approved: 0, total: 0 });
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

    const fetchTeacherProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = JSON.parse(atob(token.split('.')[1])).user.id;

            const res = await axios.get(`${API_URL}/api/teachers`);
            const teacher = res.data.find(t => t.userId._id === userId);

            if (teacher) {
                setTeacherId(teacher._id);
            }
        } catch (error) {
            console.error('Error fetching teacher profile:', error);
        }
    }, [API_URL]);

    const fetchAppointments = useCallback(async () => {
        if (!teacherId) return;

        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `${API_URL}/api/appointments/teacher/${teacherId}`,
                { headers: { 'x-auth-token': token } }
            );

            setAppointments(res.data);

            const pending = res.data.filter(a => a.status === 'pending').length;
            const approved = res.data.filter(a => a.status === 'approved').length;
            setStats({ pending, approved, total: res.data.length });
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    }, [API_URL, teacherId]);

    useEffect(() => {
        fetchTeacherProfile();
    }, [fetchTeacherProfile]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleApprove = async (appointmentId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_URL}/api/appointments/${appointmentId}/approve`,
                {},
                { headers: { 'x-auth-token': token } }
            );
            alert('Appointment approved!');
            fetchAppointments();
        } catch (error) {
            console.error(error);
            alert('Failed to approve appointment');
        }
    };

    const handleReject = async (appointmentId) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_URL}/api/appointments/${appointmentId}/reject`,
                { rejectionReason: reason },
                { headers: { 'x-auth-token': token } }
            );
            alert('Appointment rejected');
            fetchAppointments();
        } catch (error) {
            console.error(error);
            alert('Failed to reject appointment');
        }
    };

    const pendingAppointments = appointments.filter(a => a.status === 'pending');

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '80px auto 0' }}>
            <h1>Teacher Dashboard</h1>

            <h3>Stats</h3>
            <p>Pending: {stats.pending}</p>
            <p>Approved: {stats.approved}</p>
            <p>Total: {stats.total}</p>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <button
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                    }}
                    onClick={() => navigate('/teacher/messages')}
                >
                    Messages
                </button>
            </div>

            <h2>Pending Requests</h2>
            {pendingAppointments.length === 0 ? (
                <p>No pending requests</p>
            ) : (
                pendingAppointments.map(apt => (
                    <div key={apt._id}>
                        <p>{apt.student.name}</p>
                        <button onClick={() => handleApprove(apt._id)}>Approve</button>
                        <button onClick={() => handleReject(apt._id)}>Reject</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default TeacherDashboard;
