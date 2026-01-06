import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "./nav.js";
function RootLayout() {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
}

export default RootLayout;