import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import React, { useContext, useState, useMemo, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { appAlert } from "./Utils";
import { useAuth } from "./auth/use-auth-client";
import { MostSubmitButton, MyAutocomplete, MyTextField } from "./components/MostComponents";
import { DTFooter, DTGrow } from "./components/useStyles";

/**
 * Acquisto di cartucce (che sono già esistenti su tavola cartridge):
 *
 * Diventano disponibili per l'utente nella tavola cartridge_use
 *
 * TBD 1) Gestione pagamento 2) http outcall per delivery fisica delle cartucce
 */
export const Purchase = (props) => {
    const navigate = useNavigate();
    const { backendActor, logout } = useAuth();
    const react_router_location = useLocation();
    console.log(`Purchase react_router_location: ${JSON.stringify(react_router_location)}`);
    const params = useParams();
    console.log(`Purchase params: ${JSON.stringify(params)}`);
    let dossier_id = "";

    if (params.dossierid) {
        dossier_id = params.dossierid;
        //console.log("DENTRO dossier_id: " + dossier_id);
    } else {
        //console.log("uselocation: " + JSON.stringify(react_router_location));
        dossier_id = react_router_location.pathname.split("/")[2];
    }
    const { t } = useTranslation(["dossier"]);
    const [disabledButs, setDisabledButs] = useState(true);
    const [count, setCount] = useState("0");
    const [amount, setAmount] = useState("");
    const cartridge_count_list = ["1", "2", "3"];

    const ComputeAmount = (v) => {
        console.log("Comopute am: ", v);
        const a = (Number(v) * 2).toString();
        console.log("Comopute a: ", a);
        setAmount(a);
        setCount(v);
        setDisabledButs(false);
    };

    const onSubmit = () => {
        const vals = {};
        vals.count = count;
        vals.uuid = uuidv4();
        vals.purchase_time = new Date().toISOString();
        console.log(`onSubmit: ${JSON.stringify(vals)}`);
        setDisabledButs(true);
        // setLoading(true);

        backendActor
            .cartridge_use_insert(vals)
            .then((Ok_data) => {
                console.log("artwork_mark returns: ", JSON.stringify(Ok_data));
                const response = Ok_data.Ok;
                console.log(response);
                if (response) {
                    setDisabledButs(true);
                    const url = "/dossier";
                    navigate(url, { replace: true });
                } else {
                    appAlert(JSON.stringify(Ok_data.Err));
                    setDisabledButs(false);
                }
            })
            .catch((error) => {
                // handle error
                console.error(error);
                appAlert(error.message ? error.message : JSON.stringify(error));
                setDisabledButs(false);
                // setLoading(false);
            });
    };

    return (
        <>
            <Header />
            <h1>{t("Purchase")}</h1>
            <Container maxWidth="sm">
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={6}>
                        {" "}
                        <span className="padding10">{t("CartridgeCount")} </span>
                    </Grid>
                    <Grid item xs={6}>
                        {" "}
                        <MyAutocomplete name="cartridge_count" required={true} label={t("cartridge_count")} options={cartridge_count_list} freeSolo={true} onChange={(e, v) => ComputeAmount(v)} />{" "}
                    </Grid>
                    <Grid item xs={12}>
                        {" "}
                        &nbsp;{" "}
                    </Grid>

                    <Grid item xs={6}>
                        {" "}
                        <span className="padding10">{t("Total Amount")}</span>
                    </Grid>
                    <MyTextField name="amount" value={amount} label={t("amount")} />
                    <MostSubmitButton onClick={onSubmit} disabled={disabledButs} label={t("Acquista")} />
                </Grid>
            </Container>
            <Footer />
        </>
    );
};
