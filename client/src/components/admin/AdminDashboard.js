import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
    const [teachers, setTeachers] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        subject: '',
        qualification: '',
        experience: '',
        bio: ''
    });

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            const res = await axios.get(`${API_URL}/api/teachers`);
            setTeachers(res.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

            // Create user
            const userResponse = await axios.post(
                `${API_URL}/api/admin/users`,
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'teacher'
                },
                { headers: { 'x-auth-token': token } }
            );

            // Create teacher profile
            await axios.post(
                `${API_URL}/api/teachers`,
                {
                    userId: userResponse.data.user.id,
                    subject: formData.subject,
                    qualification: formData.qualification,
                    experience: formData.experience,
                    bio: formData.bio
                },
                { headers: { 'x-auth-token': token } }
            );

            alert('Teacher added successfully!');
            setShowAddForm(false);
            setFormData({
                name: '',
                email: '',
                password: '',
                subject: '',
                qualification: '',
                experience: '',
                bio: ''
            });
            fetchTeachers();
        } catch (error) {
            console.error('Error adding teacher:', error);
            alert(error.response?.data?.msg || 'Failed to add teacher');
        }
    };

    const handleDelete = async (teacherId) => {
        if (!window.confirm('Are you sure you want to delete this teacher?')) return;

        try {
            const token = localStorage.getItem('token');
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

            await axios.delete(`${API_URL}/api/teachers/${teacherId}`, {
                headers: { 'x-auth-token': token }
            });

            alert('Teacher deleted successfully');
            fetchTeachers();
        } catch (error) {
            console.error('Error deleting teacher:', error);
            alert('Failed to delete teacher');
        }
    };

    const toggleActive = async (teacherId, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

            await axios.put(
                `${API_URL}/api/teachers/${teacherId}`,
                { isActive: !currentStatus },
                { headers: { 'x-auth-token': token } }
            );

            fetchTeachers();
        } catch (error) {
            console.error('Error updating teacher status:', error);
        }
    };

    const styles = {
        container: {
            padding: '20px',
            maxWidth: '1200px',
            margin: '80px auto 0'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
        },
        addButton: {
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        formCard: {
            padding: '20px',
            marginBottom: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: '#fff'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        },
        input: {
            padding: '10px',
            fontSize: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
        },
        textarea: {
            padding: '10px',
            fontSize: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            minHeight: '80px'
        },
        buttonContainer: {
            display: 'flex',
            gap: '10px'
        },
        submitButton: {
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        cancelButton: {
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        teacherCard: {
            padding: '20px',
            marginBottom: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: '#fff'
        },
        teacherHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
        },
        teacherName: {
            fontSize: '1.3rem',
            fontWeight: 'bold'
        },
        actionButtons: {
            display: 'flex',
            gap: '10px'
        },
        deleteButton: {
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        toggleButton: {
            padding: '8px 16px',
            backgroundColor: '#ffc107',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        statusBadge: {
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            marginLeft: '10px'
        },
        active: {
            backgroundColor: '#28a745',
            color: '#fff'
        },
        inactive: {
            backgroundColor: '#dc3545',
            color: '#fff'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Admin Dashboard - Manage Teachers</h1>
                <button
                    style={styles.addButton}
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? 'Cancel' : '+ Add New Teacher'}
                </button>
            </div>

            {showAddForm && (
                <div style={styles.formCard}>
                    <h2>Add New Teacher</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} style={styles.input} required />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={styles.input} required />
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} style={styles.input} required />
                        <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} style={styles.input} required />
                        <input type="text" name="qualification" placeholder="Qualification" value={formData.qualification} onChange={handleChange} style={styles.input} required />
                        <input type="number" name="experience" placeholder="Experience (years)" value={formData.experience} onChange={handleChange} style={styles.input} required />
                        <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange} style={styles.textarea} />
                        <div style={styles.buttonContainer}>
                            <button type="submit" style={styles.submitButton}>Add Teacher</button>
                            <button type="button" style={styles.cancelButton} onClick={() => setShowAddForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <h2>All Teachers ({teachers.length})</h2>

            {teachers.length === 0 ? (
                <p>No teachers found.</p>
            ) : (
                teachers.map((teacher) => (
                    <div key={teacher._id} style={styles.teacherCard}>
                        <div style={styles.teacherHeader}>
                            <div>
                                <span style={styles.teacherName}>{teacher.userId.name}</span>
                                <span
                                    style={{
                                        ...styles.statusBadge,
                                        ...(teacher.isActive ? styles.active : styles.inactive)
                                    }}
                                >
                                    {teacher.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div style={styles.actionButtons}>
                                <button
                                    style={styles.toggleButton}
                                    onClick={() => toggleActive(teacher._id, teacher.isActive)}
                                >
                                    {teacher.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    style={styles.deleteButton}
                                    onClick={() => handleDelete(teacher._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <p><strong>Subject:</strong> {teacher.subject}</p>
                        <p><strong>Qualification:</strong> {teacher.qualification}</p>
                        <p><strong>Experience:</strong> {teacher.experience} years</p>
                        <p><strong>Email:</strong> {teacher.userId.email}</p>
                        {teacher.bio && <p><strong>Bio:</strong> {teacher.bio}</p>}
                    </div>
                ))
            )}
        </div>
    );
}

export default AdminDashboard;
