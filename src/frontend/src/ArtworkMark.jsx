import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PropagateLoader from "react-spinners/PropagateLoader";
// import { css } from "@emotion/core";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from 'uuid';

import { Ed25519KeyIdentity } from "@dfinity/identity";
import { HttpAgent } from "@dfinity/agent";
import { AssetManager } from "@dfinity/assets";

import { useGlobalState } from "./state";
import { Header } from "./Header";
import { Footer } from "./Footer";
// import { FileUpload } from "./components/FileUpload";
import { DocData } from "./components/DocData";
import { DTRoot, DTSubmit } from "./components/useStyles";
//import MyAxios, { check_response } from "./MyAxios";
import Grid from "@mui/material/Grid";
import { GoToHomePage } from "./components/OpusComponents";
import { Upload } from "./Upload";
import { getBackendActor } from "./SignIn";
import { MyTextField, MyCheckbox, MyAutocomplete, MostSubmitButton, MostCheckbox, MostSelect, MostTextField } from "./components/MostComponents";
import { backend } from "../../declarations/backend";

export const ArtworkMark = (props) => {
  const backendActor = getBackendActor();
  const newDossierInfo = props.newDossierInfo;
  const navigate = useNavigate();
  let react_router_location = useLocation();
  console.log("ArtworkMark location: " + JSON.stringify(react_router_location));
  // let dossier_id = react_router_location.state.dossier_id;
  let  dossier_id = react_router_location.pathname.split("/")[2];

  let autore_list = ["pippo", "pluto"];
  let tipodocumento_list = ["immagine", "titolo_proprietà"];

  useEffect(() => {
    if (backendActor === null) {
      navigate("/login");
    }
  });

  if (false) {
    // Hardcoded principal: 535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe
    // Should be replaced with authentication method e.g. Internet Identity when deployed on IC
    const canisterId = process.env.CANISTER_ID_FRONTEND;
    const identity = Ed25519KeyIdentity.generate(new Uint8Array(Array.from({ length: 32 }).fill(0)));
    const isLocal = !window.location.host.endsWith("ic0.app");
    const agent = new HttpAgent({
      // host: isLocal ? `http://127.0.0.1:${window.location.port}` : 'https://ic0.app', identity,
      host: isLocal ? `http://127.0.0.1:3000` : "https://ic0.app",
      identity,
    });
    if (isLocal) {
      agent.fetchRootKey();
    }
    const assetManager = new AssetManager({ canisterId, agent });
  }

  const { t } = useTranslation(["translation", "documento"]);
  const [loading, setLoading] = useState(false);
  const [disabledButs, setDisabledButs] = useState(false);
  const [uploadInfo, setUploadInfo] = useState(null);
  const [dossierInfo, setDossierInfo] = useState(null);
  const [docs, setDocs] = useState([]);
  const { control, register, handleSubmit, errors, setValue } = useForm();
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [autore, setAutore] = useState("");
  const [titolo, setTitolo] = useState("");
  const [asset, setAsset] = useState({ key: "" });
  const [uploads, setUploads] = useState([]);
  const [progress, setProgress] = useState(null);
  const appAlert = useCallback((text) => {
    alert(text);
  }, []);
  const [markDullCode, setMarkDullCode] = useState("");
  const [markPosition, setMarkPosition] = useState("");

  const onSubmit = (vals) => {
    console.log("Entro onSubmit: " + JSON.stringify(vals));
    // if (!asset) { appAlert("File non scelto"); return; }
    // vals.dossier_id = Number(dossier_id);
    vals.dossier_id = dossier_id;
    vals.username = "xxx";
    vals.ora_inserimento = new Date();
    vals.mark_dull_code = "xxxx-yyy-zzz";
    vals.mark_position = "retro, x: 10, y:0";
    vals.note = "boh, qualcosa";
    vals.uuid = uuidv4();

    console.log("onSubmit: " + JSON.stringify(vals));
    setDisabledButs(true);
    setLoading(true);

    backendActor
      .artwork_mark_insert(JSON.stringify(vals))
      .then((Ok_data) => {
        console.log("artwork_mark returns: ", JSON.stringify(Ok_data));
        let response = Ok_data.Ok;
        console.log(response);
        if (response) {
          setDisabledButs(true);
          let url = "/dossierdetail/" + dossier_id;
          navigate(url, {replace: true});
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
        setLoading(false);
      });
  };

  console.log("AAAAAAA");
  // manca parametro alla url
  if (!dossier_id) {
    console.log("BBBBBB");
    return <GoToHomePage />;
  }

  return (
    <div>
      <Header />
      <h1> {t("ArtworkMark")} </h1>
      <Container component="main" maxWidth="md">
        <div className={DTRoot}>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={6}> <span className="padding10">{t("CodiceDNA")} </span></Grid>
                <Grid item xs={6}> <MyTextField name="mark_dull_code" required={true} label={t("mark_dull_code")} onChange={(e) => setMarkDullCode(e.target.value)} /> </Grid>

                <Grid item xs={6}> <span className="padding10">{t("PosizioneDNA")}</span></Grid>
                <Grid item xs={6}> <MyTextField name="mark_position" required={true} label={t("mark_position")} onChange={(e) => setMarkPosition(e.target.value)} /> </Grid>

              <Grid item xs={12}> {" "} &nbsp; </Grid>

              <MostSubmitButton disabled={disabledButs} label={t("dossier:Inserisci")} />
            </Grid>
          </form>
        </div>
      </Container>
      <Footer />
    </div>
  );
};
