import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { DTGrow, DTFooter } from "./components/useStyles";

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
