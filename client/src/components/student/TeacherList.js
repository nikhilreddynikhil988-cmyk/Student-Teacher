import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TeacherList() {
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTeachers();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = teachers.filter(teacher =>
                teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.userId.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTeachers(filtered);
        } else {
            setFilteredTeachers(teachers);
        }
    }, [searchTerm, teachers]);

    const fetchTeachers = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            const res = await axios.get(`${API_URL}/api/teachers`);
            setTeachers(res.data);
            setFilteredTeachers(res.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
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
        searchBar: {
            width: '100%',
            padding: '12px',
            fontSize: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '30px',
        },
        teacherGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
        },
        teacherCard: {
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: '#fff',
            cursor: 'pointer',
            transition: 'transform 0.2s',
        },
        teacherName: {
            fontSize: '1.3rem',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#333',
        },
        subject: {
            color: '#007bff',
            fontSize: '1rem',
            marginBottom: '10px',
        },
        info: {
            color: '#666',
            fontSize: '0.9rem',
            marginBottom: '5px',
        },
        bio: {
            color: '#666',
            fontSize: '0.9rem',
            marginTop: '10px',
            lineHeight: '1.5',
        },
        button: {
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
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

    return (
        <div style={styles.container}>
            <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
            </button>

            <div style={styles.header}>
                <h1>Browse Teachers</h1>
                <p>Find the perfect teacher for your learning needs</p>
            </div>

            <input
                type="text"
                placeholder="Search by teacher name or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchBar}
            />

            <div style={styles.teacherGrid}>
                {filteredTeachers.length === 0 ? (
                    <p>No teachers found.</p>
                ) : (
                    filteredTeachers.map(teacher => (
                        <div
                            key={teacher._id}
                            style={styles.teacherCard}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={styles.teacherName}>{teacher.userId.name}</div>
                            <div style={styles.subject}>📚 {teacher.subject}</div>
                            <div style={styles.info}>🎓 {teacher.qualification}</div>
                            <div style={styles.info}>⏱️ {teacher.experience} years experience</div>
                            {teacher.bio && (
                                <div style={styles.bio}>{teacher.bio}</div>
                            )}
                            <button
                                style={styles.button}
                                onClick={() => navigate(`/student/book-appointment/${teacher._id}`)}
                            >
                                Book Appointment
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TeacherList;
