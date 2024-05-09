// Aquisto di cartucce (già esistenti su tavola cartridge):
//  Diventato disponbili per l'utente nella tavola cartridge_use
// TBD Gestione pagamento
// TBD http outcall per delivery fisica delle cartucce

import React, { useContext, useState, useMemo, useEffect, useCallback } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid';
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { Header } from "./Header";
import { Footer } from "./Footer";
import { DTGrow, DTFooter } from "./components/useStyles";
import { DnaFile } from "./components/DnaFile";
import { myContext } from "./components/MyContext";
import { MyTextField, MostSubmitButton, MyAutocomplete } from "./components/MostComponents";
import { getBackendActor } from "./SignIn";
import { appAlert } from "./Utils";
import { useAuth } from "./auth/use-auth-client";

export const Purchase = (props) => {
    const navigate = useNavigate();
  const { backendActor, logout } = useAuth();
  let react_router_location = useLocation();
  console.log("DossierDetail react_router_location: " + JSON.stringify(react_router_location));
  let params = useParams();
  console.log("DossierDetail params: " + JSON.stringify(params));
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
    const [dnaText, setDnaText] = useState("");
  const mark_position_list = [ "top_left", "top_center", "top_right", "center_left", "center_center", "center_right", "bottom_left", "bottom_center", "bottom_right"]
  const [count, setCount] = useState("0");
  const [amount, setAmount] = useState("");
  const cartridge_count_list = [ "1", "2", "3"]
  // const [ whoami, setWhoami, backendActor, setBackendActor, assetPfx, setAssetPfx ] = useContext(myContext);
  // const backendActor = getBackendActor();
  // const whoami = "2vxsx-fae";

  const ComputeAmount = (v) => {
      console.log("Comopute am: ", v);
      let a = (Number(v) *2).toString();
      console.log("Comopute a: ", a);
      setAmount(a);
      setCount(v);
      setDisabledButs(false);
  }

  const onSubmit = () => {
      let vals = {}
    // vals.mark_position = markSide + " " + markPosition;
      // vals.dna_text = dnaText;
    vals.count = count;
    vals.uuid = uuidv4();
    vals.purchase_time = new Date().toISOString();
    console.log("onSubmit: " + JSON.stringify(vals));
    setDisabledButs(true);
    // setLoading(true);

    backendActor
      .cartridge_use_insert(vals)
      .then((Ok_data) => {
        console.log("artwork_mark returns: ", JSON.stringify(Ok_data));
        let response = Ok_data.Ok;
        console.log(response);
        if (response) {
          setDisabledButs(true);
          let url = "/dossier";
          navigate(url, {replace: true});
        } else {
          appAlert(JSON.stringify(Ok_data.Err));
          setDisabledButs(false);
        }
      })
      .catch(function (error) {
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
        <Typography variant="body1">Insert DNA</Typography>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={6}> <span className="padding10">{t("CartridgeCount")} </span></Grid>
                <Grid item xs={6}> <MyAutocomplete name="cartridge_count" required={true} label={t("cartridge_count")} options={cartridge_count_list} freeSolo={true} onChange={(e, v) => ComputeAmount(v)} /> </Grid>

                <Grid item xs={6}> <span className="padding10">{t("Total Amount")}</span></Grid>
      <MyTextField name="amount" value={amount} label={t("amount")} />
              <MostSubmitButton onClick={onSubmit} disabled={disabledButs} label={t("Acquista")} />
      </Grid>
      </Container>
      <Footer />
    </>
  );
};
