import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { appAlert } from "./Utils";
import { MostSubmitButton, MyTextField } from "./components/MostComponents";

import { useAuth } from "./auth/use-auth-client";
import { DTRoot } from "./components/useStyles";

/**
 * Utente fornisce friendly name da mettere nelal tavola RBAC (Role Based Access Control
 *
 */
export const SelfDefineUser = () => {
    const { backendActor, principal } = useAuth();
    const userInfo = "pippo";
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [friendlyName, setFriendlyName] = useState("");
    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    console.log("AAAA");

    const onSubmit = (vals) => {
        console.log(friendlyName);
        backendActor
            .insert_caller(friendlyName)
            .then((Ret_data) => {
                // console.log("dossier returns: ", JSON.stringify(Ret_data));
                if ("Ok" in Ret_data) {
                    console.log("insert_caller Ok response: ", Ret_data);
                    navigate("/dossier");
                } else {
                    const err = Ret_data.Err;
                    console.log("insert_caller Err response: ", err);
                    console.error(err);
                    appAlert(err.CanisterError.message);
                }
            })
            .catch((error) => {
                console.error(error);
                alert(error.message ? error.message : JSON.stringify(error));
            });
    };

    return (
        <>
            <Header />
            <h1>{t("IdentifyMyself")}</h1>
            <Container component="main" maxWidth="md">
                <div className={DTRoot}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item xs={12}>
                                {" "}
                                <MyTextField name="friendlyname" required={true} label={t("FriendlyName")} onChange={(e) => setFriendlyName(e.target.value)} />{" "}
                            </Grid>
                            <Grid item xs={12}>
                                {" "}
                                &nbsp;{" "}
                            </Grid>
                            <MostSubmitButton label={t("dossier:Inserisci")} />
                        </Grid>
                    </form>
                </div>
            </Container>
            <Footer />
        </>
    );
};
