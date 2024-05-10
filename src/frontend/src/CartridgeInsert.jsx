import React, { useContext, useState, useMemo, useEffect, useCallback } from "react";
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
import { myContext } from "./components/MyContext";
import { Upload } from "./Upload";
import { getBackendActor } from "./SignIn";
import { DnaFile } from "./components/DnaFile";
import { backend } from "../../declarations/backend";
import { useAuth } from "./auth/use-auth-client";

export const CartridgeInsert = () => {
  const { control, register, handleSubmit, watch, formState: { errors }, } = useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pdfAsset, setPdfAsset] = useState("");
  const [disabledButs, setDisabledButs] = useState(true);
  const [searchele, setSearchele] = useState(false);
  const [note, setNote] = useState("");
  const [dnaText, setDnaText] = useState("");
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState("");
  const [csvData, setCsvData] = useState("");
  const [csvText, setCsvText] = useState("");
  const [jsonText, setJsonText] = useState("");
  // const [ whoami, setWhoami, backendActor, setBackendActor, assetPfx, setAssetPfx ] = useContext(myContext);
  // const backendActor = getBackendActor();
  // const whoami = "2vxsx-fae";
  const { backendActor, logout } = useAuth();


    const gotXls = (e) => {
        console.log("gotXls: ");
        setFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[1];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
          console.log("json: ", json);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
          console.log("csv: ", csv);
        setJsonText(JSON.stringify(json, null, 2));
        setCsvText(csv);
      };
      reader.readAsBinaryString(e.target.files[0]);
        setDisabledButs(false);
    }

  const onSubmit = (vals) => {
    vals.uuid = uuidv4();
    vals.dna_text = csvText;
      if (pdfAsset == "" ) {
        vals.dna_file_asset = "NO file";
      } else {
        vals.dna_file_asset = pdfAsset.key;
      }
    vals.lab_name = "Laboratorio CNR Catania";
    vals.note = note;

    vals.insert_time = new Date();
    vals.username = "proprio io";

    setDisabledButs(true);
    console.log("onSubmit: ", JSON.stringify(vals));
    backendActor
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
        alert(error.message ? error.message : JSON.stringify(error));
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

        <DnaFile setDisabledButs={setDisabledButs} setCsvText={setCsvText} setJsonText={setJsonText}/>
                <Grid item xs={6}> <span className="padding10">{t("DnaFilePdf")}</span></Grid>
                <Grid item xs={6}> <Upload accept={"application/pdf"} asset={pdfAsset} setAsset={setPdfAsset} setDisabledButs={setDisabledButs} show={false} /> </Grid>
                <Grid item xs={12}> {" "} &nbsp; </Grid>
      </Grid>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1} alignItems="center">
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
