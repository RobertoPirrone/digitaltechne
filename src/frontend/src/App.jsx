import { ThemeProvider, createMuiTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useState, Suspense } from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";

import { Admin } from "./Admin";
import { ArtworkMark } from "./ArtworkMark";
import { CartridgeInsert } from "./CartridgeInsert";
import { ChangeRbac } from "./ChangeRbac";
import { Dossier } from "./Dossier";
// import { DossierDetail } from "./DossierDetailGramberg";
import { Home } from "./Home";
import { GlobalProvider, GlobalContext } from "./Global";
import { JsonCompare } from "./JsonCompare";
import { LandingPage } from "./LandingPage";
import { Manual } from "./Manual";
import { NewDocument } from "./NewDocument";
// import { BatchInsert, NewDossier } from "./NewGrambergDossier";
import { Purchase } from "./Purchase";
import { SelfDefineUser } from "./SelfDefineUser";
// import { UserRoles } from "./UserRoles";
import { VerifyMark } from "./VerifyMark";
import Login from "./auth/Login";
import { Logout } from "./auth/Logout";
import { themeCommon } from "./components/themeCommon";
import "./App.css";
import { AuthProvider, useAuth } from "./auth/use-auth-client";

import { backend } from "declarations/backend";

let app = process.env.REACT_APP_APPLICATION;
console.log(process.env);

let mod, theme, DossierDetail, BatchInsert, NewDossier;
switch (app) {
    case 'gramberg':
        mod = await import ("./DossierDetailGramberg.jsx");
        DossierDetail = mod.DossierDetail;
        mod = await import ("./NewDossierGramberg.jsx");
        BatchInsert = mod.BatchInsert;
        NewDossier = mod.NewDossier;
        mod = await import ("./components/themeGramberg.jsx");
        theme = mod.theme;
        break;
    case 'valsecchi':
        mod = await import ("./DossierDetailValsecchi.jsx");
        DossierDetail = mod.DossierDetail;
        mod = await import ("./NewDossierValsecchi.jsx");
        BatchInsert = mod.BatchInsert;
        NewDossier = mod.NewDossier;
        mod = await import ("./components/themeValsecchi.jsx");
        theme = mod.theme;
        break;
    default:
        const err = `Unknown application ${app}`;
        alert(err);
        throw new Error(err);
}

function Loading() {
    return <h2>🌀 Loading...</h2>;
}

function App() {
    const { isAuthenticated, identity } = useAuth();
    // console.error(process.env);

    return (
        <GlobalProvider>
        <ThemeProvider theme={themeCommon}>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <div className="App">
                {isAuthenticated ? (
                    <Router>
                        <Routes>
                            <Route path="/artwork_mark/:dossierdetail" element={<ArtworkMark />} />
                            <Route path="/cartridge_insert" element={<CartridgeInsert />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/dossier" element={<Dossier />} />
                            <Route path="/dossier/:dossierdetail" element={<Dossier />} />
                            <Route path="/dossierdetail/:dossierdetail" element={<DossierDetail />} />
                            <Route path="/json_compare" element={<JsonCompare />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/manual" element={<Manual />} />
                            <Route path="/newdocument" key="dossier_id" element={<NewDocument />} />
                            <Route path="/newdossier" element={<NewDossier />} />
                            <Route path="/batchinsert" element={<BatchInsert />} />
                            <Route path="/purchase" element={<Purchase />} />
                            <Route path="/selfdefineuser" element={<SelfDefineUser />} />
                            <Route path="/admin" element={<Admin />} />
                            <Route path="/change_rbac" element={<ChangeRbac />} />
                            <Route path="/verify_mark/:dossierdetail" element={<VerifyMark />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/" element={<LandingPage />} />
                        </Routes>
                    </Router>
                ) : (
                    <Login />
                )}
            </div>
        </ThemeProvider>
        </ThemeProvider>
        </GlobalProvider>
    );
}
export default () => (
    <Suspense fallback={Loading()}>
        <AuthProvider>
            <App />
        </AuthProvider>
    </Suspense>
);
