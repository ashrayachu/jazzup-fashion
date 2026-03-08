import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const ProtectedRoute = ({ children, role }) => {
 const {isAuthenticated, userType} = useAuthStore();
    // const user = {role:"admin" }// Mock user for demonstration
    


    if ( !isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (userType !== role) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
