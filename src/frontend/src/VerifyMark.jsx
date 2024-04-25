import React, { useState, useMemo, useEffect, useCallback } from "react"; import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid';
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { DTGrow, DTFooter } from "./components/useStyles";
import { DnaFile } from "./components/DnaFile";
import { MostSubmitButton, MyAutocomplete } from "./components/MostComponents";

export const VerifyMark = () => {
  const { t } = useTranslation(["dossier"]);
  const [disabledButs, setDisabledButs] = useState(false);
    const [dnaText, setDnaText] = useState("");
  const mark_position_list = [ "top_left", "top_center", "top_right", "center_left", "center_center", "center_right", "bottom_left", "bottom_center", "bottom_right"]
  const [markPosition, setMarkPosition] = useState("");
  const mark_side_list = [ "front", "right", "frame"]
  const [markSide, setMarkSide] = useState("");

  const onSubmit = () => {
      let vals = {}
    vals.mark_position = markSide + " " + markPosition;
      vals.dna_text = dnaText;
      console.log(JSON.stringify(vals));
  }


  return (
    <>
      <Header />
      <h1>{t("VerifyMark")}</h1>
      <Container maxWidth="sm">
        <Typography variant="body1">Insert DNA</Typography>
        <DnaFile setDnaText={setDnaText}/>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={6}> <span className="padding10">{t("MarkSide")} </span></Grid>
                <Grid item xs={6}> <MyAutocomplete name="mark_side" required={true} label={t("mark_side")} options={mark_side_list} onChange={(e, v) => setMarkSide(v)} /> </Grid>

                <Grid item xs={6}> <span className="padding10">{t("PosizioneDNA")}</span></Grid>
                <Grid item xs={6}> <MyAutocomplete name="mark_position" required={true} label={t("mark_position")} options={mark_position_list} onChange={(e, v) => setMarkPosition(v)} /> </Grid>
              <MostSubmitButton onClick={onSubmit} disabled={disabledButs} label={t("dossier:Inserisci")} />
      </Grid>
      </Container>
      <Footer />
    </>
  );
};
