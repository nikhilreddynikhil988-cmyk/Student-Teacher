import React from "react";
function Default() {
    const styles = {
        rootContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            color: "#4b4848ff",
            fontSize: "1.5rem",
            backgroundColor: "#f0f0f0",
        },
    };
    return (
        <h2 style={styles.rootContainer}>The dictionary of knowledge </h2>
    );
}
export default Default;