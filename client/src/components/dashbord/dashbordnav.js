import React from "react";

function Dashbordnav() {
    const styles = {
        navbar: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            background: "#fff",
            zIndex: 1000,
            display: "flex",
            justifyContent: "space-between", // Push items apart
            alignItems: "center", // Align vertically center
            padding: "0 20px",
            marginTop:"10px"
        },
        heading: {
            color: "#6815edff",
            fontSize: "1.5rem",
            fontWeight: "bold",
            margin: 0,
        },
        line: {
            border: "none",
            borderTop: "1.5px solid #0e60dbff",
            margin: 0
        },
        button: {
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            padding: "8px 16px",
            fontSize: "1rem",
            marginRight:"25px"
        }
    };

    return (
        <nav style={styles.navbar}>
            <h1 style={styles.heading}>📚 ENKBook</h1>
            <button style={styles.button}>Logout</button>
        </nav>
    );
}

export default Dashbordnav;
