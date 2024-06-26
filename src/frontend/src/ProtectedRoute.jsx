import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./auth/use-auth-client";

export const ProtectedRoute = () => {
    const { isAuthenticated, identity , principal} = useAuth();
    if (! isAuthenticated) {
        console.log("ProtectedRoute isAuthenticated FALSE ");
        Navigate("/login");
    }
    console.log(`ProtectedRoute isAuthenticated ${isAuthenticated}, principal ${principal.toText()}`);

    return  <Outlet /> 
};

// auth.token ? <Outlet/> : <Navigate to='/login'/>
