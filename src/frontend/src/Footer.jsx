import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import React from "react";
import { DTFooter, DTGrow } from "./components/useStyles";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary">
            {"Copyright © "}
            <Link color="inherit" href="https://www.digitaltechne.ch" target="_blank" rel="noopener">
                https://digitaltechne.ch
            </Link>{" "}
            {new Date().getFullYear()}
        </Typography>
    );
}

export const Footer = () => {
    return (
        <>
            <div className="UnderFooter" />
            <footer className={DTFooter}>
                <Container maxWidth="sm">
                    <Copyright />
                </Container>
            </footer>
        </>
    );
};
