import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { checkLoggedUser } from "./SignIn";

export const ProtectedRoute = () => {
  const navigate = useNavigate();
  let username = checkLoggedUser();
  if (username === "") {
    console.log("ProtectedRoute No Auth");
    navigate("/login");
  }
  // console.log("ProtectedRoute username: ", username);
  return <Outlet />;
};
