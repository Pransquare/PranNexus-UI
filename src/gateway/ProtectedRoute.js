import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import dayjs from "dayjs";

const ProtectedRoute = ({ children, roleName = [] }) => {
  const isAuthenticated = localStorage.getItem("jwtToken");
  const expiryTime = localStorage.getItem("expiryTime");

  // Check if token or expiry is missing or expired
  if (!isAuthenticated || !expiryTime || dayjs().isAfter(dayjs(expiryTime))) {
    console.log("Token missing or expired. Redirecting to login.");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("expiryTime");
    localStorage.removeItem("roleNames");
    return <Navigate to="/login" />;
  }

  // Role check
  if (roleName.length > 0) {
    const roleNames = JSON.parse(localStorage.getItem("roleNames") || "[]");
    console.log("Stored roles:", roleNames);
    console.log("Required roles:", roleName);

    // Check if any of the required roles match the user's roles
    const hasRequiredRole = roleName.some((role) => roleNames.includes(role));

    if (!hasRequiredRole) {
      console.log("User lacks the required role. Redirecting to home.");
      return <Navigate to="/home" />;
    }
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
