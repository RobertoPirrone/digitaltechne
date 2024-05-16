import React from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

import { Footer } from './Footer';
import { Header } from './Header';
import { MostSubmitButton, } from "./components/MostComponents";

const hasRole = () => {
    return true
}

export const Home = () => {
    const userInfo = "pippo";
    const { t } = useTranslation();
    const navigate = useNavigate();
    const AdminRole = hasRole("Admin",userInfo)
    const LaboratoryRole = hasRole("Laboratory",userInfo)
    const OwnerRole = hasRole("Owner",userInfo)
    const UserRole = hasRole("User",userInfo)
    console.log("AAAA");

    return (
  <div className="app-container">
    <Header />
    <div className="content-container">
    <Container component="main" maxWidth="md">
        <h1>{t("HomeWelcome")} {userInfo.name} {userInfo.surname}</h1>
        <Grid container spacing={1} alignItems="flex-start" className="blackColor">
        { AdminRole ?
            <React.Fragment>
            <Grid item xs={6}>
                {t("Administrator")}
            </Grid>
            <Grid item xs={6}>
                    <MostSubmitButton className="b_loginok" onClick={() => navigate("/user_roles")} label={t("Gestione Utenti")} id="user_roles" />

            </Grid>
            </React.Fragment>
        : null
        }
        { OwnerRole ?
            <React.Fragment>
            <Grid item xs={6}>
                {t("Owner")}
            </Grid>
            <Grid item xs={6}>
                    <MostSubmitButton className="b_loginok" onClick={() => navigate("/dossier", {replace: true})} label={t("Mostra Opere")} id="dossier" />
                    <MostSubmitButton className="b_loginok" onClick={() => navigate("/newdossier", {replace: true})} label={t("Inserisci una nuova opera")} id="newdossier" />
                    <MostSubmitButton className="b_loginok" onClick={() => navigate("/purchase", {replace: true})} label={t("Acquista Cartucce DNA")} id="purchase" />
            </Grid>
            </React.Fragment>
        : null
        }
        {UserRole ?
            <React.Fragment>
            <Grid item xs={6}>
                {t("Laboratory")}
            </Grid>
            <Grid item xs={6}>
                    <MostSubmitButton className="b_loginok" onClick={() => navigate("/cartridge_insert")} label={t("Registrazione Cartucce")} id="cartridge_insert" />
            </Grid>
            </React.Fragment>
        : null
        }
            <Grid item xs={6}>
                {t("Funzioni per tutti gli utenti")}
            </Grid>
            <Grid item xs={6}>
                <MostSubmitButton className="b_loginok" onClick={() => navigate("/manual")} label={t("Manuale On Line")} id="manual" />
            </Grid>
        </Grid>
    </Container>
    </div>
    <Footer />
  </div>
    );
};
