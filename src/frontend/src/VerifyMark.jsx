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
import { DnaFile } from "./components/DnaFile";
import { MostSubmitButton, MyAutocomplete } from "./components/MostComponents";
import { getAssetPfx } from "./utils";
import { useAuth } from "./auth/use-auth-client";

export const VerifyMark = (props) => {
  const navigate = useNavigate();
  const { backendActor, logout } = useAuth();
  let react_router_location = useLocation();
  const dossierInfo = react_router_location.state.dossierInfo;
  console.log("DossierDetail react_router_location: " + JSON.stringify(react_router_location));
  let params = useParams();
  console.log("DossierDetail params: " + JSON.stringify(params));
  let dossier_id = "";
  const asset_pfx = getAssetPfx();

  if (params.dossierid) {
    dossier_id = params.dossierid;
  } else {
    dossier_id = react_router_location.pathname.split("/")[2];
  }
  const { t } = useTranslation(["translation", "dossier"]);
  const [disabledButs, setDisabledButs] = useState(true);
  const [csvText, setCsvText] = useState("");
  const [jsonText, setJsonText] = useState("");
  const mark_position_list = [ "top_left", "top_center", "top_right", "center_left", "center_center", "center_right", "bottom_left", "bottom_center", "bottom_right"]
  const [markPosition, setMarkPosition] = useState("");
  const mark_side_list = [ "front", "back", "frame"]
  const [markSide, setMarkSide] = useState("");

  function Csv2Json(csvText){
    //Split all the text into seperate lines on new lines and carriage return feeds
      console.log("Csv2Json csvText: ", csvText);
    var allTextLines = csvText.split('\n');
    var lines = [];
    var locations = [];

    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split('\t');
        // console.log(data);
        var location = {"Locus":data[0], "Alleli":data[1], "Esempio di un profilo DNA":data[5]};
        locations.push(location);
    }
    return locations;
  }

  const intersect = (first_array, second_array) => {
      first_array = first_array.split('\n');
      second_array = second_array.split('\n');
    console.log("first_array: ", first_array);
    console.log("second_array: ", second_array);
    let common_array = [];
    first_array.forEach((r) => {
        if (second_array.includes(r)) {
            common_array.push(r);
        }
    })
    console.log("common_array: ", common_array);
    let slim_first = first_array.
        filter( (element) =>
            !common_array.includes(element)
    );
      slim_first = slim_first.join('\n');
    let slim_second = second_array.
        filter( (element) =>
            !common_array.includes(element)
    );
      slim_second = slim_second.join('\n');
    console.log("slim_first: ", slim_first);
    return [slim_first, slim_second];
  };

  const onSubmit = () => {
      let vals = {}
    vals.dossier_id = dossier_id;
    console.log("onSubmit: " + JSON.stringify(vals));
    setDisabledButs(true);
    // setLoading(true);

    backendActor
      .artwork_mark_query(vals)
      .then((Ok_data) => {
        console.log("artwork_mark returns: ", JSON.stringify(Ok_data));
          let response = JSON.parse(Ok_data.Ok);

        // console.log(response);
        if (response) {
          setDisabledButs(true);
            // su DB in formato CSV
            let csvOldData= response.artwork_marks[0].dna_text;
            console.log("csvOldData: ", csvOldData);
            let [first, second]  = intersect(csvOldData, csvText);

            let oldData = Csv2Json(first);
            let pos =  response.artwork_marks[0].mark_position;
            oldData.mark_position = { "mark_location": pos};
            console.log("oldData post: ", oldData);

            let newData= Csv2Json(second);
            pos = markSide + " " + markPosition;
            newData.mark_position = { "mark_location": pos};

            navigate("/json_compare", { state: {oldData: oldData, newData: newData}});
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
              <Grid item xs={12} spacing={1}>
                        <img src={`${asset_pfx}${dossierInfo.icon_uri}`} width={200} /> 
              </Grid>
        <Typography variant="body1">DNA data</Typography>
        <DnaFile setDisabledButs={setDisabledButs} setCsvText={setCsvText} setJsonText={setJsonText}/>
        <Grid container spacing={1} alignItems="center">
            <Grid item xs={6}> <span className="padding10">{t("MarkSide")} </span></Grid>
            <Grid item xs={6}> <MyAutocomplete name="mark_side" required={true} label={t("mark_side")} options={mark_side_list} onChange={(e, v) => setMarkSide(v)} /> </Grid>

            <Grid item xs={6}> <span className="padding10">{t("PosizioneDna")}</span></Grid>
            <Grid item xs={6}> <MyAutocomplete name="mark_position" required={true} label={t("mark_position")} options={mark_position_list} onChange={(e, v) => setMarkPosition(v)} /> </Grid>
          <MostSubmitButton onClick={onSubmit} disabled={disabledButs} label={t("dossier:Verify")} />
        </Grid>
      </Container>
      <Footer />
    </>
  );
};
