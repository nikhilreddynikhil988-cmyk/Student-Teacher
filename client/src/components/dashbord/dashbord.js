import React from "react";
function Dashbord() {

    const styles = {
        body: {
            backgroundColor: "#f0f0f0",
            height: "100vh",
        },
        container: {
            textAlign: "center",
            padding: "20px",
        },
        bar: {
            display: "flex",
            justifyContent: "center",
        },
        button: {
            color: "#000000",
            backgroundColor: "#ffffff",
            fontSize: "1rem",
            padding: "10px 70px",
            border: "none",
            cursor: "pointer",
        }
    };

    return (
        <div style={styles.body}>
            <div style={styles.container}>
                <h2 style={{ marginTop: "60px" }}>Admin Dashboard</h2>
                <p>Manage teachers and students registration</p>
            </div>
            <div style={styles.bar}>
                <div style={{ display: "flex", backgroundColor: "white", marginRight: "15px", marginLeft: "15px", borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}>
                    <button>Manage Teachers</button>
                    <button style={styles.button}>Manage Students</button>
                    <button style={styles.button}>Pending Requests</button>
                </div>
            </div>
        </div>
    );
}
export default Dashbord;