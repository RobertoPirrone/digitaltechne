import React, { useState, useEffect, useCallback } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from "xlsx";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { DTGrow, DTFooter } from "./components/useStyles";
import { MyTextField, MyCheckbox, MyAutocomplete, MostSubmitButton, MostCheckbox, MostSelect, MostTextField } from "./components/MostComponents";
import { useGlobalState } from "./state";
import { DTRoot } from "./components/useStyles";
import { Upload } from "./Upload";
import { backend } from "../../declarations/backend";

export const CartridgeInsert = () => {
  const { control, register, handleSubmit, watch, formState: { errors }, } = useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pdfAsset, setPdfAsset] = useState({});
  const [xlsAsset, setXlsAsset] = useState({});
  const [disabledButs, setDisabledButs] = useState(true);
  const [searchele, setSearchele] = useState(false);
  const [note, setNote] = useState("");
  const [dnaText, setDnaText] = useState("");
    const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState("");


    const Xls2Json = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setJsonData(JSON.stringify(json, null, 2));
      };
      reader.readAsBinaryString(file);
    }
  };

  const onSubmit = (vals) => {
    if (! file ) {
      appAlert("File Xls Analisi non scelto");
      return;
    }
      Xls2Json();
    vals.uuid = uuidv4();
    vals.dna_text = jsonData;
      if (pdfAsset == {} ) {
        vals.dna_file_asset = "";
      } else {
        vals.dna_file_asset = pdfAsset.key;
      }
    vals.lab_name = "Laboratorio CNR Catania";
    vals.note = note;

    vals.ora_inserimento = new Date();
    vals.username = "proprio io";

    setDisabledButs(true);
    console.log("onSubmit: ", JSON.stringify(vals));
    backend
      .cartridge_insert(JSON.stringify(vals))
      .then((Ok_data) => {
        console.log("cartridge_insert returns: ", JSON.stringify(Ok_data));
        let response = JSON.parse(Ok_data.Ok);
        console.log(response);
        if (response) {
          setDisabledButs(true);
          navigate("/dossier");
        } else {
          console.error(response);
          appAlert(response.error);
          setDisabledButs(false);
        }
      })
      .catch(function (error) {
        console.error(error);
        appAlert(error.message ? error.message : JSON.stringify(error));
        setDisabledButs(false);
      });

  }


  return (
    <>
      <Header />
      <h1>{t("CartridgeInsert")}</h1>
      <Container component="main" maxWidth="md">
        <div className={DTRoot}>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={6}> <span className="padding10">{t("DnaFileXls")}</span></Grid>
                <Grid> <input type="file" accept=".xls,.xlsx" onChange={(e) => setFile(e.target.files[0])} /> </Grid>

                <Grid item xs={6}> <span className="padding10">{t("DnaFilePdf")}</span></Grid>
                <Grid item xs={6}> <Upload asset={pdfAsset} setAsset={setPdfAsset} setDisabledButs={setDisabledButs} accept={"application/pdf"} show={false} /> </Grid>
                <Grid item xs={12}> {" "} &nbsp; </Grid>
      </Grid>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12}> <MyTextField name="dna_text" label={t("DnaText")} onChange={(e) => setDnaText(e.target.value)} /> </Grid>
              <Grid item xs={12}> <MyTextField name="note" label={t("note")} onChange={(e) => setNote(e.target.value)} /> </Grid>

              <Grid item xs={12}> {" "} &nbsp; </Grid>

              <MostSubmitButton disabled={disabledButs} label={t("dossier:Inserisci")} />
            </Grid>
          </form>
        </div>
      </Container>
      <Footer />
    </>
  );
}
