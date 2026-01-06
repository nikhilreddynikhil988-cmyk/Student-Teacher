import React, { useState } from "react";
import { Link } from "react-router-dom";

function Crdnav() {
    const [selected, setSelected] = useState(null);

    const getButtonStyle = (index) => ({
        color: selected === index ? "#ffffff" : "#000000",
        backgroundColor: selected === index ? "#0074D9" : "#ffffff",
        fontSize: "1rem",
        padding: "10px 70px",
        border: "none",
        cursor: "pointer",
        borderRadius: index === 0
            ? "20px 0 0 20px"
            : "0 20px 20px 0"
    });

    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <Link to="/login">
                <button
                    style={getButtonStyle(0)}
                    onClick={() => setSelected(0)}
                >
                    LOGIN
                </button>
            </Link>
            <Link to="/register">
                <button
                    style={getButtonStyle(1)}
                    onClick={() => setSelected(1)}
                >
                    REGISTER
                </button>
            </Link>
        </div>
    );
}
export default Crdnav;
