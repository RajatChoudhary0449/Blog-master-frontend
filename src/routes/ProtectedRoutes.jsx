import React from 'react'
import { useAuthStore } from "../services/store/authStore";
import { Navigate } from "react-router-dom";
// import useUserData from "../../hooks/useUserData";
export default function ProtectedRoutes({ element }) {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)();
    return isLoggedIn ? element : <Navigate to="/login" />;
}
