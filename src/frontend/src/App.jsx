import React, { useState, Suspense } from "react";
// import { useIdleTimer } from 'react-idle-timer'
import { Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";

import { createMuiTheme, ThemeProvider } from "@mui/material/styles";
// import CssBaseline from "@material-ui/core/CssBaseline";
import { theme } from "./components/theme";

// import GuardedRoute from './GuardedRoute';
import { ProtectedRoute } from "./ProtectedRoute";
// import { CertificationRequest } from './CertificationRequest';
import { Dossier } from "./Dossier";
import { DossierDetail } from "./DossierDetail";
import { Home } from "./Home";
import { Login, Logout } from "./SignIn";
// import { LoginOk } from './LoginOk';
//import { MMLogin} from './MMLogin';
// import { ForgottenPasswd } from './auth/ForgottenPasswd';
import { NewDocument } from "./NewDocument";
import { NewDossier } from "./NewDossier";
// import { NftInfo } from './NftInfo';
// import { Reload } from './Reload';
// import { Register } from './Register';
// import { BC } from './BC';
// import { Identity } from './auth/Identity';
// import { ChangePasswd } from './auth/ChangePasswd';
// import { Timeout, NoMatch } from './components/MostComponents';
// import AlertDialog from './AlertDialog';
// import { ProvideAuth } from "./use-auth";
//import logo from './Smartag.png';
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
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/loginok" element={<Home />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}
export default App;
