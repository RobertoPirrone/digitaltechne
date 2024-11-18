import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useContext } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../Global";
import { Home } from "../Home";
import { MostSubmitButton } from "../components/MostComponents";
import { DTPaper } from "../components/useStyles";
import { useAuth } from "./use-auth-client";
// import logo from '/Liliana Gramberg.jpg';
// import logo from '/DT-noalpha.png';

function Login() {
    const { isAuthenticated, login } = useAuth();
    const { t, i18n } = useTranslation();
    const infoUrl = "/html/MISC/first_info.html";
    console.log("Login, isAuthenticated: ", isAuthenticated);
    const logo = useContext(GlobalContext).logo;
    const autore = useContext(GlobalContext).autore;

    return (
        <>
            {isAuthenticated ? (
                <Home />
            ) : (
                <Container component="main" maxWidth="xs">
                    <Grid container>
                        <Grid item xs={12}>
                            <img src={logo} width={400} className="XXXApp-logo" alt="logo" />
                            <Grid item xs={12}>
                                <Typography component="h1" variant="h5">
                                    {`${autore} ${t("Artwork Archive")}`}
                                </Typography>
                                <div className="w-1/2 mb-4">
                                    <MostSubmitButton onClick={login} className="makeStyles-submit-4" label={t("SignIn.Sign In")} />
                                </div>
                            </Grid>
                            <br />
                            <br />
                            <Grid item xs={12}>
                                <a href={infoUrl} rel="noreferrer">
                                    {t("Clicca qui per help e informazioni")}
                                </a>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </>
    );
}

export default Login;
