import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AccessDeniedOutlet = () => {
    const token = localStorage.getItem('token');
    const isAuth = token !== null && token !== undefined && token.trim() !== "";

    return !isAuth ? <Outlet /> : <Navigate to="/" />
}

export default AccessDeniedOutlet;