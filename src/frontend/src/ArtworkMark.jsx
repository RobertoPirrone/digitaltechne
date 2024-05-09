import React, { useContext, useState, useMemo, useEffect, useCallback } from "react";
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
import { myContext } from "./components/MyContext";
import { Upload } from "./Upload";
import { getBackendActor } from "./SignIn";
import { MyTextField, MyCheckbox, MyAutocomplete, MostSubmitButton, MostCheckbox, MostSelect, MostTextField } from "./components/MostComponents";
import { backend } from "../../declarations/backend";
import { getAssetPfx } from "./utils";
import { useAuth } from "./auth/use-auth-client";

export const ArtworkMark = (props) => {
  const asset_pfx = getAssetPfx();
  const navigate = useNavigate();
  let react_router_location = useLocation();
  console.log("ArtworkMark location: " + JSON.stringify(react_router_location));
  const dossierInfo = react_router_location.state.dossierInfo;
  console.log("dossierInfo: " + JSON.stringify(dossierInfo));
  // let dossier_id = react_router_location.state.dossier_id;
  let  dossier_id = react_router_location.pathname.split("/")[2];

  let autore_list = ["pippo", "pluto"];
  let tipodocumento_list = ["immagine", "titolo_proprietà"];
  const [cartridgeUuids, setCartridgeUuids] = useState([]);
  // const [ whoami, setWhoami, backendActor, setBackendActor, assetPfx, setAssetPfx ] = useContext(myContext);
  const { backendActor, principal } = useAuth();
  // const backendActor = getBackendActor();
  // const whoami = "2vxsx-fae";

  useEffect(() => {
      backendActor.cartridge_use_available()
      .then((Ok_data) => {
        console.log("useEffect returns: ", JSON.stringify(Ok_data));
        let response = JSON.parse(Ok_data.Ok);
        console.log(response);
        if (response) {
          let uuids = (response.cartridge_uses.map((item) => {
            return item.uuid 
          }));
          setCartridgeUuids(uuids);
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
    if (backendActor === null) {
      navigate("/login");
    }
  }, []);

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
  const mark_position_list = [ "top_left", "top_center", "top_right", "center_left", "center_center", "center_right", "bottom_left", "bottom_center", "bottom_right"]
  const [markPosition, setMarkPosition] = useState("");
  const mark_side_list = [ "front", "back", "frame"]
  const [markSide, setMarkSide] = useState("");

  const onSubmit = (vals) => {
    console.log("Entro onSubmit: " + JSON.stringify(vals));
    // if (!asset) { appAlert("File non scelto"); return; }
    // vals.dossier_id = Number(dossier_id);
    vals.dossier_id = dossier_id;
    vals.username = "xxx";
    vals.ora_inserimento = new Date();
    vals.mark_dull_code = markDullCode;
    vals.mark_position = markSide + " " + markPosition;
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
            <Grid container spacing={1} >
              <Grid item xs={12} spacing={1}>
                        <img src={`${asset_pfx}${dossierInfo.icon_uri}`} width={200} /> 
              </Grid>

                <Grid item xs={6}> <span className="padding10">{t("DNA Code")} </span></Grid>
                <Grid item xs={6}> <MyAutocomplete name="mark_dull_code" required={true} label={t("mark_dull_code")} options={cartridgeUuids} freeSolo={false} onChange={(e,v) => setMarkDullCode(v)} /> </Grid>

                <Grid item xs={6}> <span className="padding10">{t("Mark Side")} </span></Grid>
                <Grid item xs={6}> <MyAutocomplete name="mark_side" required={true} label={t("mark_side")} options={mark_side_list} onChange={(e, v) => setMarkSide(v)} /> </Grid>

                <Grid item xs={6}> <span className="padding10">{t("Mark Position")}</span></Grid>
                <Grid item xs={6}> <MyAutocomplete name="mark_position" required={true} label={t("mark_position")} options={mark_position_list} onChange={(e, v) => setMarkPosition(v)} /> </Grid>

              <Grid item xs={6}> {" "} &nbsp; </Grid>

              <MostSubmitButton disabled={disabledButs} label={t("dossier:Inserisci")} />
            </Grid>

          </form>
        </div>
      </Container>
      <Footer />
    </div>
  );
};
