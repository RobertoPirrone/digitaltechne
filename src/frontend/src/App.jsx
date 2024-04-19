import React, { useState, Suspense } from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@mui/material/styles";
import { theme } from "./components/theme";
import { ProtectedRoute } from "./ProtectedRoute";
import { Dossier } from "./Dossier";
import { DossierDetail } from "./DossierDetail";
import { Home } from "./Home";
import { Login, Logout } from "./SignIn";
import { NewDocument } from "./NewDocument";
import { NewDossier } from "./NewDossier";
import { CartridgeInsert } from "./CartridgeInsert";
import { UserRoles } from "./UserRoles";
import { ArtworkMark } from "./ArtworkMark";
import { VerifyMark } from "./VerifyMark";
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
              <Route path="/dossier" element={<Dossier />} />
              <Route path="/dossierdetail/:dossierdetail" element={<DossierDetail />} />
              <Route path="/newdossier" element={<NewDossier />} />
              <Route path="/newdocument" key="dossier_id" element={<NewDocument />} />
              <Route path="/cartridge_insert" element={<CartridgeInsert />} />
              <Route path="/artwork_mark/:dossierdetail" element={<ArtworkMark />} />
              <Route path="/verify_mark" element={<VerifyMark />} />
              <Route path="/user_roles" element={<UserRoles />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/home" element={<Home />} />
            <Route path="/loginok" element={<Home />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}
export default App;
