import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AppLayout from "./AppLayout";
import AccessDenied from "./AccessDenied";

const AuthenticatedOutlet = ({ roles }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const isAuth = token !== null && token !== undefined && token.trim() !== "";
    const hasRole = roles.includes(user['role']);

    return isAuth ? (hasRole ? <AppLayout><Outlet /></AppLayout> : <AccessDenied />) : <Navigate to="/Login" />
}

export default AuthenticatedOutlet;