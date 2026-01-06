import React from "react";
import { Outlet } from "react-router-dom";
import Dashbordnav from "./dashbordnav.js";
function Dashbordlayout() {
    return (
        <div>
            <Dashbordnav />
            <Outlet />
        </div>
    );
}
export default Dashbordlayout;