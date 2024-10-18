/**
 * Change Permissions to the user identified by the state property
 */
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { appAlert } from "./Utils";
import { useAuth } from "./auth/use-auth-client";
import { MostCheckbox, MostSelect, MostSubmitButton, MostTextField, MyAutocomplete, MyCheckbox, MyTextField } from "./components/MostComponents";

export const ChangeRbac = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { handleSubmit } = useForm();
    const { backendActor, principal } = useAuth();
    const react_router_location = useLocation();
    const user_row = react_router_location.state.row;
    console.log("ChangeRbac user_row ", user_row);


    useEffect(() => {
        console.log(t("uso di t()"));
        console.log("ChangeRbac useEffect");
    }, [t]);

    const onSubmit = (vals) => {
        console.log("onSubmit: ");
        console.log(vals);
        backendActor
            .change_rbac(JSON.stringify(vals))
            .then((Ok_data) => {
                appAlert(t("Permissions are updated"));
                navigate("/admin");
            })
            .catch((error) => {
                appAlert(error.message ? error.message : JSON.stringify(error));
            });
    };

    return (
        <>
            <Header />
            <h1>{t("ChangeRbac")}</h1>
            <Container maxWidth="sm">
                <Typography variant="body1">TBD</Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={12}>
                            {" "}
                            &nbsp;{" "}
                        </Grid>

                        <MostSubmitButton label={t("Modify")} />
                    </Grid>
                </form>
            </Container>
            <Footer />
        </>
    );
};
