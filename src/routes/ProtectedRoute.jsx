import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }) => {
    const user = JSON.parse(localStorage.getItem("adminUser"));

     if (!user) {
        return <Navigate to="/login" replace />;
    }

     if (roleRequired === "super_admin" && user.role !== "super_admin") {
        return <Navigate to="/admin/plans" replace />;
    }

    return children;
};

export default ProtectedRoute;