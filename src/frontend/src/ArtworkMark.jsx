import React, { useContext, useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PropagateLoader from "react-spinners/PropagateLoader";
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
import { UploadNew } from "./UploadNew";
import { DocData } from "./components/DocData";
import { DTRoot, DTSubmit } from "./components/useStyles";
import Grid from "@mui/material/Grid";
import { GoTo, GoToHomePage } from "./components/OpusComponents";
import { Upload } from "./Upload";
import { MyTextField, MyCheckbox, MyAutocomplete, MostSubmitButton, MostCheckbox, MostSelect, MostTextField } from "./components/MostComponents";
import { backend } from "../../declarations/backend";
import { getAssetPfx } from "./utils";
import { useAuth } from "./auth/use-auth-client";

export const ArtworkMark = (props) => {
  const asset_pfx = getAssetPfx();
  const navigate = useNavigate();
  let react_router_location = useLocation();
  let  dossier_id = react_router_location.pathname.split("/")[2];
  const [assets, setAssets] = useState([{}]);

  let autore_list = ["pippo", "pluto"];
  let tipodocumento_list = ["immagine", "titolo_proprietà"];
  const [cartridgeUuids, setCartridgeUuids] = useState([]);
  const { backendActor, principal } = useAuth();
  console.log("ArtworkMark location: " + JSON.stringify(react_router_location));
    let dossierInfo = {};
    if (react_router_location.state === null) 
        return (<GoTo location={"/dossier"} />);
    dossierInfo = react_router_location.state.dossierInfo;
  console.log("dossierInfo: " + JSON.stringify(dossierInfo));

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
  const [disabledButs, setDisabledButs] = useState(true);
  const [uploadInfo, setUploadInfo] = useState(null);
  const [docs, setDocs] = useState([]);
  const { control, register, handleSubmit, errors, setValue } = useForm();
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [autore, setAutore] = useState("");
  const [titolo, setTitolo] = useState("");
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
    // if (!asset) { appAlert("File non scelto"); return; }
    // vals.dossier_id = Number(dossier_id);

    let asset = {};
    for (asset of assets) {
        vals.uuid = uuidv4();
        vals["dossieropera_id"] = Number(dossier_id);
        vals["title"] = titolo;
        vals["autore"] = autore;
        // vals["tipo_documento"] = tipo_documento;
        vals["tipo_documento"] = "ARTWORK_MARK_PICTURE";
        vals["image_uri"] = asset.key;
        vals["filename"] = asset.original_filename;
        vals["mimetype"] = asset.mimetype;
        vals["filesize"] = asset.file_size;
        vals["versione"] = 1;
        vals.ora_inserimento = new Date();

        console.log("onSubmitDocument: " + JSON.stringify(vals));
        setDisabledButs(true);
        setLoading(true);

        backendActor
          .document_insert(JSON.stringify(vals))
          .then((Ok_data) => {
            console.log("document_insert returns: ", JSON.stringify(Ok_data));
            let response = Ok_data.Ok;
            // alert(JSON.stringify(response));
            console.log(response);
             if (response) {
                console.error(response);
            } else {
              console.error("response vuota");
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
          // let url = "/dossierdetail/" + dossier_id;
          // navigate(url, { state: {dossierInfo: dossierInfo}, replace: true });
            appAlert("RESPONSE");
          navigate("/dossier", { replace: true });
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
                <Grid item xs={6}> <UploadNew assets={assets} show={false} setAssets={setAssets} setDisabledButs={setDisabledButs} label={t("dossier:LoadJpgs")} /> </Grid>

              <Grid item xs={6}> {" "} &nbsp; </Grid>

            </Grid>
            <form onSubmit={handleSubmit(onSubmit)}>
              <MostSubmitButton disabled={disabledButs} label={t("dossier:Inserisci")} />
          </form>
        </div>
      </Container>
      <Footer />
    </div>
  );
};
