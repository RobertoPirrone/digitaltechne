import React, { useContext, useState, useMemo, useEffect, useCallback } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid';
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { DTGrow, DTFooter } from "./components/useStyles";
import { myContext } from "./components/MyContext";
import { DnaFile } from "./components/DnaFile";
import { MostSubmitButton, MyAutocomplete } from "./components/MostComponents";
import { getBackendActor } from "./SignIn";

export const VerifyMark = (props) => {
    const navigate = useNavigate();
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
  const [markPosition, setMarkPosition] = useState("");
  const mark_side_list = [ "front", "back", "frame"]
  const [markSide, setMarkSide] = useState("");
  const [ whoami, setWhoami, backendActor, setBackendActor, assetPfx, setAssetPfx ] = useContext(myContext);

  const onSubmit = () => {
      let vals = {}
    // vals.mark_position = markSide + " " + markPosition;
      // vals.dna_text = dnaText;
    vals.dossier_id = dossier_id;
    console.log("onSubmit: " + JSON.stringify(vals));
    setDisabledButs(true);
    // setLoading(true);

    backendActor
      .artwork_mark_query(vals)
      .then((Ok_data) => {
        console.log("artwork_mark returns: ", JSON.stringify(Ok_data));
          let response = JSON.parse(Ok_data.Ok);

        console.log(response);
        if (response) {
          setDisabledButs(true);
        console.log(response.artwork_marks);
            let oldData= JSON.parse(response.artwork_marks[0].dna_text);
            console.log("oldData: ", oldData);
            let newData= JSON.parse(dnaText);
            console.log("newData: ", newData);
            console.log("oldData post: ", oldData);
            let pos = markSide + " " + markPosition;
            newData.mark_position = { "mark_location": pos};
            pos =  response.artwork_marks[0].mark_position;
            oldData.mark_position = { "mark_location": pos};
            console.log("newData post: ", newData);
            navigate("/json_compare", { state: {oldData: oldData, newData: newData}, replace: true});
        } else {
          console.error(response);
          appAlert(response.error);
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
      <h1>{t("VerifyMark")}</h1>
      <Container maxWidth="sm">
        <Typography variant="body1">Insert DNA</Typography>
        <DnaFile setDisabledButs={setDisabledButs} setDnaText={setDnaText}/>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={6}> <span className="padding10">{t("MarkSide")} </span></Grid>
                <Grid item xs={6}> <MyAutocomplete name="mark_side" required={true} label={t("mark_side")} options={mark_side_list} onChange={(e, v) => setMarkSide(v)} /> </Grid>

                <Grid item xs={6}> <span className="padding10">{t("PosizioneDNA")}</span></Grid>
                <Grid item xs={6}> <MyAutocomplete name="mark_position" required={true} label={t("mark_position")} options={mark_position_list} onChange={(e, v) => setMarkPosition(v)} /> </Grid>
              <MostSubmitButton onClick={onSubmit} disabled={disabledButs} label={t("dossier:Verify")} />
      </Grid>
      </Container>
      <Footer />
    </>
  );
};
