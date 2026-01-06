import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'student' });
    const navigate = useNavigate();

    const styles = {
        registerContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            textAlign: "center",
        },
        registerForm: {
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
            margin: "15px",
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            const response = await axios.post(`${API_URL}/api/auth/register`, formData);

            // server returns a token on success
            if (response.data && response.data.token) {
                console.log('Registration token:', response.data.token);
                // optionally store token for immediate auth
                // localStorage.setItem('token', response.data.token);
                alert('Registration successful! Please login.');
                navigate('/login');
            } else if (response.data && response.data.msg) {
                // handle friendly server messages
                alert(response.data.msg);
            } else {
                alert('Registration completed. Please login.');
                navigate('/login');
            }
        } catch (error) {
            const serverMessage = error.response && (error.response.data && (error.response.data.msg || error.response.data.message));
            console.error("Registration failed:", serverMessage || error.message);
            alert(serverMessage || 'Registration failed. Please try again.');
        }
    };

    return (
        <div style={styles.registerContainer}>
            <form style={styles.registerForm} onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" style={styles.inputField} value={formData.username} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" style={styles.inputField} value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" style={styles.inputField} value={formData.password} onChange={handleChange} required />
                <select name="role" style={styles.inputField} value={formData.role} onChange={handleChange}>
                    {/* <option value="default" > - - -Select option- - - </option> */}
                    <option value="student">Student</option>
                    {/* Admin registration should ideally be handled separately */}
                </select>
                <button type="submit" style={styles.submitButton}>Register</button>
            </form>
        </div>
    );
}
export default Register;