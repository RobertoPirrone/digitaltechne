import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { useGlobalState } from './state';

export const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useGlobalState('username');
  console.log("ProtectedRoute username: ", username);

  useEffect(() => {
    if (username === "") {
        navigate("/login");
    }
  });

  return(
    <Outlet/> 
  );
};


