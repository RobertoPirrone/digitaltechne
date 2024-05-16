import React, { useState, Suspense } from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@mui/material/styles";

import { ArtworkMark } from "./ArtworkMark";
import { CartridgeInsert } from "./CartridgeInsert";
import { Dossier } from "./Dossier";
import { DossierDetail } from "./DossierDetail";
import { Home } from "./Home";
import { LandingPage } from "./LandingPage";
import LoggedOut from "./auth/LoggedOut";
import {Logout} from "./auth/Logout";
import { JsonCompare } from "./JsonCompare";
import { Manual } from "./Manual";
import { NewDocument } from "./NewDocument";
import { NewDossier } from "./NewDossier";
import { ProtectedRoute } from "./ProtectedRoute";
import { Purchase } from "./Purchase";
import { UserRoles } from "./UserRoles";
import { VerifyMark } from "./VerifyMark";
import { theme } from "./components/theme";
import "./App.css";
import { useAuth, AuthProvider } from "./auth/use-auth-client";

import { backend } from "declarations/backend";

function App() {
  const { isAuthenticated, identity } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
      {isAuthenticated ? 
        <Router>
          <Routes>
              <Route path="/artwork_mark/:dossierdetail" element={<ArtworkMark />} />
              <Route path="/cartridge_insert" element={<CartridgeInsert />} />
              <Route path="/home" element={<Home />} />
              <Route path="/dossier" element={<Dossier />} />
              <Route path="/dossierdetail/:dossierdetail" element={<DossierDetail />} />
              <Route path="/json_compare" element={<JsonCompare />} />
              <Route path="/home" element={<Home />} />
              <Route path="/manual" element={<Manual />} />
              <Route path="/newdocument" key="dossier_id" element={<NewDocument />} />
              <Route path="/newdossier" element={<NewDossier />} />
              <Route path="/purchase" element={<Purchase />} />
              <Route path="/user_roles" element={<UserRoles />} />
              <Route path="/verify_mark/:dossierdetail" element={<VerifyMark />} />
            <Route path="/login" element={<LoggedOut />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </Router>

          : <LoggedOut />}
      </div>
    </ThemeProvider>
  );
}
export default () => (
    <AuthProvider>
    <App />
    </AuthProvider>
);
