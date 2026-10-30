import React, { Children } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useAutoLogout from "../hooks/useAutoLogout";

const ProtectedSuperAdminRoute = ({ children }) => {
    const { user, authLoading } = useAuth();

    useAutoLogout();

    if (authLoading) return null;

    if(!user) {
        return <Navigate to="/admin" replace />;
    }

    if(user.role !== "superadmin"){
        return <Navigate to="/admin" replace />;
    }

    return children;
};

export default ProtectedSuperAdminRoute;