import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    // server expects email and password for login
    const [formData, setFormData] = useState({ email: '', password: '' });

    const navigate = useNavigate();
    const styles = {
        loginContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            textAlign: "center",

        },
        loginForm: {

            padding: "20px",
            borderRadius: "8px",
            width: "100%",
        },
        inputField: {
            margin: "15px",
            marginBottom: "15px",
            padding: "10px",
            width: "380px",
            borderRadius: "4px",
            border: "1px solid #ccc",

        },
        submitButton: {
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            margin: "25px",

        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            const response = await axios.post(`${API_URL}/api/auth/login`, formData);
            const { token, user } = response.data;
            if (token) {
                localStorage.setItem('token', token);

                // Redirect based on role
                if (user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else if (user.role === 'teacher') {
                    navigate('/teacher/dashboard');
                } else {
                    navigate('/dashboard'); // student dashboard
                }
            }
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data.msg : error.message);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={styles.loginContainer}>
            <form style={styles.loginForm} onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" style={styles.inputField} value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" style={styles.inputField} value={formData.password} onChange={handleChange} required />
                <button type="submit" style={styles.submitButton}>Login</button>
            </form>
        </div>
    );
}

export default Login;

