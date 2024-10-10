import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import React from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { DTFooter, DTGrow } from "./components/useStyles";

export const UserRoles = () => {
    const { t } = useTranslation();

    return (
        <>
            <Header />
            <h1>{t("UserRoles")}</h1>
            <Container maxWidth="sm">
                <Typography variant="body1">TBD</Typography>
            </Container>
            <Footer />
        </>
    );
};
