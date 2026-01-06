import React from "react";
import CardIndex from "./crd-index.js";
import Crdnav from "./crd-nav.js";
import { Outlet } from "react-router-dom";
function Card() {
    return (
        <>
            <style>
                {`
                .card-container {
                    display: flex;
                    justify-content: center;
                    margin-top: 100px;
                }
                .card {
                    display: flex;
                    flex-direction: column;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    margin-bottom: 20px;
                    background-color: #f8f0f0ff;
                    width: 40%;
                    height: 500px;
                    box-sizing: border-box;
                }
                .card-title {
                    color: #333;
                    font-size: 1.5rem;
                    font-weight: bold;
                }
                .card-content {
                    color: #666;
                    font-size: 1rem;
                }
                @media (max-width: 600px) {
                    .card {
                        width: 80%;
                    }
                }
                @media (max-width: 400px) {
                        .card {
                            width: 100%;
                        }
                    }
                @media (min-width: 601px) and (max-width: 1000px) {
                        .card {
                            width: 60%;
                        }       
                }
                `}
            </style>
            <div className="card-container">
                <div className="card">
                    <CardIndex />
                    <Crdnav />
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Card;