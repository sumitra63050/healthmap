import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // If not authenticated, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated but role doesn't match the allowed roles for this route, redirect
    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect to their respective dashboard
        if (role === 'doctor') return <Navigate to="/doctor" replace />;
        if (role === 'hospital') return <Navigate to="/hospital" replace />;
        return <Navigate to="/patient" replace />;
    }

    // Authorized user, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
