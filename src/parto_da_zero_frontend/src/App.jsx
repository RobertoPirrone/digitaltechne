import React, { useState, Suspense } from 'react';
// import { useIdleTimer } from 'react-idle-timer'
import { Route, Routes } from "react-router";
import { BrowserRouter as Router} from 'react-router-dom';

// import { createMuiTheme, ThemeProvider } from '@mui/core/styles';
// import CssBaseline from "@material-ui/core/CssBaseline";

import GuardedRoute from './GuardedRoute';
// import { CertificationRequest } from './CertificationRequest';
import { Dossier } from './Dossier';
// import { DossierDetail } from './DossierDetail';
import { Home } from './Home';
// import { Login, Logout } from './Login';
// import { LoginOk } from './LoginOk';
//import { MMLogin} from './MMLogin';
// import { ForgottenPasswd } from './auth/ForgottenPasswd';
// import { NewDocument } from './NewDocument';
// import { NewDossier } from './NewDossier';
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
import './App.css';


import { parto_da_zero_backend } from 'declarations/parto_da_zero_backend';

function App() {
  const [greeting, setGreeting] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    parto_da_zero_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  return (
      <div className="App">
        <Router>
          <Routes>
            <Route path='/dossier' key="dossier" element={<Dossier />} />
              <Route path="/" element={<Home />} />

          </Routes>
        </Router>

      </div>
  );
}
export default App;
