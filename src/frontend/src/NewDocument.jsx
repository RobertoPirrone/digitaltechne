import React, { useState, useEffect, useCallback, useContext } from "react";
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

import { checkLoggedUser, getBackendActor } from "./SignIn";
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
import { MyTextField, MyCheckbox, MyAutocomplete, MostSubmitButton, MostCheckbox, MostSelect, MostTextField } from "./components/MostComponents";
import { backend } from "../../declarations/backend";

/**
 * NewDocument: inserimento di un documento in IPFS
 *
 * <UL>
 * <LI> selezione del documento su File System Locale {@link FileUpload}
 * <LI> Form Inserimento Metadati {@link DocData}
 * <LI> upload
 * <UL>
 * Su Server:
 * <UL>
 * <LI> crypt AES
 * <LI> inserimento in IPFS, (torna Hash)
 * <LI> crypt chiave AES con chiave ellittica
 * <LI> inserimento metadatati su DB
 * </UL>
 * @see NewDossier
 *
 * @component
 * @param {string} dossier_id id del dossier a cui appartiene il documento, arriva nella URl, non come props
 */
export const NewDocument = (props) => {
    // console.log("NewDocument, whoami: ", checkLoggedUser());

  const newDossierInfo = props.newDossierInfo;
  const navigate = useNavigate();
  let react_router_location = useLocation();
  console.log("NewDocument location: " + JSON.stringify(react_router_location));
  let dossier_id = react_router_location.state.dossier_id;

  const [autoreList, setAutoreList] = useState([]);
  let tipodocumento_list = ["image", "condition report", "authenticity attribution", "certificate of ownership"];


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
  // const [ whoami, setWhoami, backendActor, setBackendActor, assetPfx, setAssetPfx ] = useContext(myContext);
  const backendActor = getBackendActor();
  const whoami = "2vxsx-fae";
          let list = [];

  useEffect(() => {
    if (backend === null) {
      navigate("/login");
    }
    backendActor.documenti_pulldowns()
      .then((result) => {
            let res = JSON.parse(result.Ok);
          console.log(res);
            res.forEach((r) => {
                list.push(r)
            })
          // va in loop!!!
          // setAutoreList(list);
      })
        .catch(function (error) {
          console.error(error);
          appAlert(error.message ? error.message : JSON.stringify(error));
        });
  }), [t];

  const onSubmit = (vals) => {
    console.log("Entro onSubmit: " + JSON.stringify(vals));
    if (!asset) {
      appAlert("File non scelto");
      return;
    }
    vals.uuid = uuidv4();
    vals["dossieropera_id"] = Number(dossier_id);
    vals["title"] = titolo;
    vals["autore"] = autore;
    // vals["tipo_documento"] = tipo_documento;
    vals["tipo_documento"] = tipoDocumento;
    vals["image_uri"] = asset.key;
    vals["filename"] = asset.original_filename;
    vals["mimetype"] = asset.mimetype;
    vals["filesize"] = asset.file_size;
    vals["versione"] = 1;
    vals.ora_inserimento = new Date();

    console.log("onSubmit: " + JSON.stringify(vals));
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
      <h1> {t("documento:NewDocument")} </h1>
      <Container component="main" maxWidth="md">
        <div className={DTRoot}>
          <Upload asset={asset} show={true} accept={"*/*"} setAsset={setAsset} setDisabledButs={setDisabledButs} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12}>
                <MyTextField name="title" required={true} label={t("documento:title")} onChange={(e) => setTitolo(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <MyAutocomplete name="autore" label={t("dossier:autore")} options={autoreList} onInputChange={(e, v) => setAutore(v)} />
              </Grid>
              <Grid item xs={12}>
                <MyAutocomplete name="tipodocumento" label={t("dossier:tipodocumento")} options={tipodocumento_list} onChange={(e, v) => setTipoDocumento(v)} />
              </Grid>

              <Grid item xs={3}>
                <text>Private</text>
                <MyCheckbox defaultChecked={false} onChange={(e, v) => setPrivateDossier(v.label)} />
              </Grid>

              <Grid item xs={12}>
                {" "}
                &nbsp;
              </Grid>

              <MostSubmitButton disabled={disabledButs} label={t("dossier:Inserisci")} />
            </Grid>
          </form>
        </div>
      </Container>
      <Footer />
    </div>
  );
};
