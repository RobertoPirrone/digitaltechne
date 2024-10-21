import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import React from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { isLocalHost } from "./Utils";
import { DTFooter, DTGrow } from "./components/useStyles";

export const Manual = () => {
    const { t } = useTranslation();

    const launch = (url) => {
        window.open("file:///Users/robi/SRC/InternetComputer/gramberg/target/doc/backend/index.html");
    };
    return (
        <>
            <Header />
            <h1>{t("Manual")}</h1>
            <Container maxWidth="xl">
                <Typography variant="body1">
                    <List>
                        <ListItem>
                            {" "}
                            <ListItemText primary="The Main user Manual" />{" "}
                            <Link color="inherit" href="/UserManual.pdf" target="_blank" rel="noopener">
                                {" "}
                                /UserManual.pdf
                            </Link>{" "}
                        </ListItem>
                        {isLocalHost() ? (
                            <>
                                <ListItem>
                                    {" "}
                                    <ListItemText primary="Backend Implementation Notes (Cut&Paste in Browser)" /> file:///Users/robi/SRC/InternetComputer/gramberg/target/doc/backend/index.html{" "}
                                </ListItem>
                                <ListItem>
                                    {" "}
                                    <ListItemText primary="Frontend Implementation Notes (Cut&Paste in Browser)" />
                                    file:///Users/robi/SRC/InternetComputer/gramberg/src/frontend/public/JSdocs/index.html{" "}
                                </ListItem>
                            </>
                        ) : null}
                    </List>
                </Typography>
            </Container>
            <Footer />
        </>
    );
};
