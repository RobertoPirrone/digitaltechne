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
import { Login, Logout } from "./SignIn";
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

import { backend } from "declarations/backend";

function App() {
  const [greeting, setGreeting] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/artwork_mark/:dossierdetail" element={<ArtworkMark />} />
              <Route path="/cartridge_insert" element={<CartridgeInsert />} />
              <Route path="/home" element={<Home />} />
              <Route path="/dossier" element={<Dossier />} />
              <Route path="/dossierdetail/:dossierdetail" element={<DossierDetail />} />
              <Route path="/json_compare" element={<JsonCompare />} />
              <Route path="/loginok" element={<Home />} />
              <Route path="/manual" element={<Manual />} />
              <Route path="/newdocument" key="dossier_id" element={<NewDocument />} />
              <Route path="/newdossier" element={<NewDossier />} />
              <Route path="/purchase" element={<Purchase />} />
              <Route path="/user_roles" element={<UserRoles />} />
              <Route path="/verify_mark/:dossierdetail" element={<VerifyMark />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}
export default App;
