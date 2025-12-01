// frontend/src/router/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute() {
    const { user } = useAuth();

    // Check if user is logged in and has admin role (role_id === 1)
    const isAdmin = user && Number(user.role_id) === 1;

    // If user is not an admin, redirect to the main login page
    return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
}

export default AdminRoute;
