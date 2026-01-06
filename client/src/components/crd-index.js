import React from "react";

function CardIndex() {
    const styles = {
        crdnav : {
            textAlign: "center",
            backgroundColor: "#0f1ebeff",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        },
        crdhead: {
            color: "#ffffff",
            fontSize: "1.8rem",
            fontWeight: "bold",
            margin: 10,
        },
        crdtitle: {
            color: "#cfced1ff",
            fontSize: "1.2rem",
            marginTop: "10px"
        }
    };
    return (
        <div style={styles.crdnav}>
                    <h2 style={styles.crdhead}>Welcome to EduBook</h2>
                    <p style={styles.crdtitle}>Academic Appointment System</p>
                </div>
    );
}
export default CardIndex;