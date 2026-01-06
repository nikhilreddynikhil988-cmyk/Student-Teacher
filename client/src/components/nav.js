import React from "react";
function Nav() {
    const styles = {
        navbar: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            background: "#fff",
            zIndex: 1000
        },
        heading: {
            color: "#6815edff",
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "left",
            padding: "15px",
            margin: 0
        },
        line: {
            border: "none",
            borderTop: "1.5px solid #0e60dbff",
            margin: 0
        }
    };
    return (
        <nav style={styles.navbar}>
            <h1 style={styles.heading}>📚 ENKBook</h1>
            <hr style={styles.line} />
        </nav>
    );
}
export default Nav;
