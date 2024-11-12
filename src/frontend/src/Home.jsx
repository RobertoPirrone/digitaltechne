import React, { useContext, useState, useMemo, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import { Footer } from "./Footer";
import { GlobalContext } from "./Global";
import { Header } from "./Header";
import { appAlert } from "./Utils";
import { useAuth } from "./auth/use-auth-client";
import { MostSubmitButton } from "./components/MostComponents";

const hasRole = () => {
    return true;
};

/**
 * Pagina con bottoni per le possibili azioni, in base ai ruoli che ha l'utente
 */
export const Home = () => {
    const { backendActor, principal } = useAuth();
    const userInfo = "pippo";
    const { t } = useTranslation();
    const navigate = useNavigate();
    const AdminRole = hasRole("Admin", userInfo);
    const LaboratoryRole = hasRole("Laboratory", userInfo);
    const OwnerRole = hasRole("Owner", userInfo);
    const UserRole = hasRole("User", userInfo);
    const {userName, setUserName} = useContext(GlobalContext);
    console.log("AAAA");

    useEffect(() => {
        if (backendActor === null) {
            console.log("Home, backendActor null");
            return;
        }
        if (backendActor === "") {
            console.log("Home, backendActor empty");
            return;
        }
        if (backendActor === "2vxsx-fae") {
            console.log("Home, backendActor 2vxsx-fae");
            return;
        }
        console.log("Home, backendActor: ", backendActor);
        backendActor
            .check_caller()
            .then((Ret_data) => {
                // console.log("dossier returns: ", JSON.stringify(Ret_data));
                if ("Ok" in Ret_data) {
                    console.log("Home check_caller Ok response: ", Ret_data.Ok);
                    setUserName(Ret_data.Ok.friendly_name);
                } else {
                    const err = Ret_data.Err;
                    console.log("Home check_caller Err response: ", err);
                    console.error(err);
                    // appAlert(err.CanisterError.message);
                    navigate("/selfdefineuser");
                }
            })
            .catch((error) => {
                console.error(error);
                alert(error.message ? error.message : JSON.stringify(error));
            });
    }, [backendActor, navigate]);

    return (
        <div className="app-container">
            <Header />
            <div className="content-container">
                <Container component="main" maxWidth="md">
                    <h1>
                        {t("HomeWelcome")} {userName} 
                    </h1>
                    <Grid container spacing={1} alignItems="flex-start" >
                        {AdminRole ? (
                            <>
                                <Grid item xs={6}>
                                    {t("Administrator")}
                                </Grid>
                                <Grid item xs={6}>
                                    <MostSubmitButton className="b_loginok" onClick={() => navigate("/admin")} label={t("Gestione Utenti")} id="user_roles" />
                                </Grid>
                            </>
                        ) : null}
                        {OwnerRole ? (
                            <>
                                <Grid item xs={6}>
                                    {t("Owner")}
                                </Grid>
                                <Grid item xs={6}>
                                    <MostSubmitButton className="b_loginok" onClick={() => navigate("/dossier", { replace: true })} label={t("Mostra Opere")} id="dossier" />
                                    <MostSubmitButton className="b_loginok" onClick={() => navigate("/newdossier", { replace: true })} label={t("Inserisci una nuova opera")} id="newdossier" />
                                    <MostSubmitButton className="b_loginok" onClick={() => navigate("/batchinsert", { replace: true })} label={t("BatchInsert")} id="batchinsert" />
                                    <MostSubmitButton className="b_loginok" onClick={() => navigate("/purchase", { replace: true })} label={t("Acquista Cartucce DNA")} id="purchase" />
                                </Grid>
                            </>
                        ) : null}
                        {UserRole ? (
                            <>
                                <Grid item xs={6}>
                                    {t("Laboratory")}
                                </Grid>
                                <Grid item xs={6}>
                                    <MostSubmitButton className="b_loginok" onClick={() => navigate("/cartridge_insert")} label={t("Registrazione Cartucce")} id="cartridge_insert" />
                                </Grid>
                            </>
                        ) : null}
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
