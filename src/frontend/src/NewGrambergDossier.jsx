import React, { useState, useEffect, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import { v4 as uuidv4 } from 'uuid';
import { XlsFile } from "./components/XlsFile";

import { MyTextField, MyCheckbox, MyAutocomplete, MostSubmitButton, MostCheckbox, MostSelect, MostTextField } from "./components/MostComponents";
import { SpecializedSelect} from "./components/SpecializedSelect";

import { useGlobalState } from "./state";
import { DTRoot } from "./components/useStyles";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Upload } from "./Upload";
import { UploadNew } from "./UploadNew";
import { backend } from "../../declarations/backend";
import { useAuth } from "./auth/use-auth-client";

export const NewDossier = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useGlobalState("username");
  const [application, setapplication] = useGlobalState("application");
  const { control, register, handleSubmit, watch, formState: { errors }, } = useForm();
  const [disabledButs, setDisabledButs] = useState(true);
  const [newDossierInfo, setNewDossierInfo] = useState({}); //pull down & C.
  const [searchele, setSearchele] = useState(false);
  const [lastInsert, setLastInsert] = useState(null);
  const { t } = useTranslation(["translation", "dossier", "tipotecnica", "tiposupporto", "tipofirma"]);
  const [uploadInfo, setUploadInfo] = useState(null);
  const [uploadInfoSignatures, setUploadInfoSignatures] = useState(null);
  const [action, setAction] = useState("");
  const [asset, setAsset] = useState({});
  const [assets, setAssets] = useState([{}]);
  const [privateDossier, setPrivateDossier] = useState(false);
  const [nomeOpera, setNomeOpera] = useState("");
  const [tipoOpera, setTipoOpera] = useState("");
  const [luogoOpera, setLuogoOpera] = useState("");
  const [autore, setAutore] = useState("");
  const [tipotecnica, setTipotecnica] = useState("");
  const [annoopera, setAnnoopera] = useState(1900);
  const [numero_totale_copie, setNumero_totale_copie] = useState(0);
  const [dimensions, setDimensions] = useState("");
  const [tipofirma, setTipofirma] = useState("");
  const [tiposupporto, setTiposupporto] = useState("");
  const { backendActor, principal } = useAuth();
  // const backendActor = getBackendActor();

  const appAlert = useCallback((text) => {
    alert(text);
  }, []);

  useEffect(() => {
    setSearchele(false);
  }, [t, searchele, appAlert, lastInsert]);

  const actionChange = (e, el) => {
    console.error(JSON.stringify(el));
    setAction(el.value);
  };

  const onInsert = (what, id) => {
    setLastInsert({ what: what, id: id });
  };

  const onSubmit = (vals) => {
    if (asset == {}) {
      appAlert("File immagine non scelto");
      return;
    }

    vals.uuid = uuidv4();
    vals.ora_inserimento = new Date();
    vals.username = username;
    vals.autore = "Liliana Gramberg";
    vals.annoopera = parseInt(annoopera);
    vals.nomeopera = nomeOpera;
    vals.tipotecnica = tipotecnica;
    vals.tipofirma = tipofirma;
    vals.dimensions = dimensions;
    vals.numero_totale_copie = parseInt(numero_totale_copie);
    vals.tiposupporto = tiposupporto;
    if (privateDossier === null || privateDossier == false) {
      vals.private = false;
    } else {
      vals.private = true;
    }
    vals.icon_uri = assets[0].key;
    setDisabledButs(true);
    console.log("onSubmit: ", JSON.stringify(vals));
    backendActor
      .dossier_insert(JSON.stringify(vals))
      .then((Ok_data) => {
        console.log("dossier_insert no json returns: ", Ok_data);
        console.log("dossier_insert returns: ", JSON.stringify(Ok_data));
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
  };

  console.log("newDossierInfo: ", JSON.stringify(newDossierInfo));
  console.log("newDossierInfo: ", JSON.stringify(newDossierInfo.autori));
  console.log("princiapl: ", principal.toText());
  return (
    <div>
      <Header />
      {application == "elivilla" ? (
        <h1>{t("dossier:NewCelebrity")}</h1>
      ) : application == "techne" ? (
        <h1>{t("dossier:NewArtwork")}</h1>
      ) : application == "hypnos" ? (
        <h1>{t("dossier:NewPainting")}</h1>
      ) : application == "cottolengo" ? (
        <h1>{t("dossier:NewDrawing")}</h1>
      ) : (
        <h1>{t("dossier:NewDossier")}</h1>
      )}
      <Container component="main" maxWidth="md">
        <div className={DTRoot}>
          <UploadNew assets={assets} show={true} asset={assets[0]} setAssets={setAssets} setDisabledButs={setDisabledButs} label={t("dossier:LoadJpgs")} />

          <form onSubmit={handleSubmit(onSubmit)} >
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12}> <MyTextField name="nomeopera" required={true} label={t("dossier:nomeopera")} onChange={(e) => setNomeOpera(e.target.value)} /> </Grid>
              <Grid item xs={12}> <SpecializedSelect defaultValue={""} name="tipotecnica" label={t("tipotecnica:Label")} what={"tipotecnica"} onChange={(e, v) => setTipotecnica(e.target.value)} /> </Grid>
              <Grid item xs={12}> <MyTextField name="annoopera" required={true} label={t("dossier:annoopera")} onChange={(e) => setAnnoopera(e.target.value)} /> </Grid>
              <Grid item xs={12}> <MyTextField name="numero_totale_copie" required={true} label={t("dossier:numero_totale_copie")} onChange={(e) => setNumero_totale_copie(e.target.value)} /> </Grid>
              <Grid item xs={12}> <MyTextField name="dimensions" required={true} label={t("dossier:dimensions")} onChange={(e) => setDimensions(e.target.value)} /> </Grid>
              <Grid item xs={12}> <SpecializedSelect defaultValue={""} name="tipofirma" label={t("tipofirma:Label")} what={"tipofirma"} onChange={(e, v) => setTipofirma(e.target.value)} /> </Grid>
              <Grid item xs={12}> <SpecializedSelect defaultValue={""} name="tiposupporto" label={t("tiposupporto:Label")} what={"tiposupporto"} onChange={(e, v) => setTiposupporto(e.target.value)} /> </Grid>

              <Grid item xs={3}> <Typography>Private</Typography> <MyCheckbox defaultChecked={false} onChange={(e, v) => setPrivateDossier(v.label)} /> </Grid>
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

export const BatchInsert = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useGlobalState("username");
  const { control, register, handleSubmit, watch, formState: { errors }, } = useForm();
  const { t } = useTranslation(["translation", "dossier", "tipotecnica", "tiposupporto", "tipofirma"]);
  const [disabledButs, setDisabledButs] = useState(true);
  const [csvText, setCsvText] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [files, setFiles] = useState([]);
  const [assets, setAssets] = useState({});
  const { backendActor, principal } = useAuth();

  const onBatchSubmit = (vals) => {
    let file_found = false;
    vals.uuid = uuidv4();
    vals.insert_time = new Date();
    vals.username = "pippo";

    setDisabledButs(true);
    console.log("onBatchSubmit vals: ", vals);
    console.log("onBatchSubmit json: ", jsonText);
    let r = {};
    let ass = {};
    let tech = "";

      outerloop: for (r of jsonText) {
        console.log("jsonText element: ", r)

        var photos = r.Photos;
        if ((photos == null) || (photos == "")) {
            console.error("Missing Photo: ", JSON.stringify(r));
            alert("Missing Photo: ", JSON.stringify(r));
            continue;
        }
        var fname = photos.toString().split("/")[0];
        var filename = `DSC_0${fname}.JPG`;
        file_found = false;
        innerloop: for (ass of assets) {
            // console.log("ASS: ", ass);
            if (ass.original_filename == filename) {
                console.error("FOUND FILENAME: ", filename);
                vals.icon_uri = ass.key;
                file_found=true;
                console.error("FOUND FILENAME2: ", filename, ", key: ", vals.icon_uri);
                break innerloop;
            }
        };
        console.log("EXIT INNERLOOP");
        if (!file_found) {
          console.log("file not found: ", filename);
          continue;
        }
            

        console.log("file found, riempimento valori: ", filename);
        vals.uuid = uuidv4();
        vals.ora_inserimento = new Date();
        vals.username = username;
        vals.autore = "Liliana Gramberg";
        vals.annoopera = r.Date != null ? parseInt(r.Date) : 1970;
        vals.nomeopera = r.Title;
        if ((r.Technique == null) || (r.Technique == "")) {
            alert("Missing Technique: ", JSON.stringify(r));
            continue;
        }
        tech = (r.Technique).toUpperCase();
        switch (tech) {
            case 'ACQUAFORTE': 
                tech = "ETCHING";
                break;
            case 'LITOGRAFIA': 
                tech = "LITOGRAPHY";
                break;
            case 'TECNICA MISTA': 
                tech = "MIXED";
                break;
            case 'XILOGRAFIA': 
                tech = "WOODCUT";
                break;
        }
        vals.tipotecnica = tech;
        vals.tipofirma = "SIGNED";
        vals.dimensions = r.Dimensions === null ? "UNK" : r.Dimensions ;
        vals.numero_totale_copie = r.EditionNumber != null ? parseInt(r.EditionNumber) : 0;
        vals.tiposupporto = "PAPER";
          vals.private = false;

        setDisabledButs(true);
        console.log("onBatchSubmit dossier_insert: ");
        console.log( vals);
        console.log("onBatchSubmit dossier_insert: ", vals);

        backendActor
          .dossier_insert(JSON.stringify(vals))
          .then((Ok_data) => {
            console.error( "OKKKK");
            console.log( Ok_data);
            console.log("dossier_insert no json returns: ", Ok_data);
            console.log("dossier_insert returns: ", JSON.stringify(Ok_data));
            let response = JSON.parse(Ok_data.Ok);
            console.log(response);
            if (response) {
              setDisabledButs(true);
              navigate("/dossier");
            } else {
              console.error(response);
              alert(response.error);
              setDisabledButs(false);
            }
          })
          .catch(function (error) {
            console.error( "CATCH");
            console.error(error);
            alert(error.message ? error.message : JSON.stringify(error));
            setDisabledButs(false);
          });
      };
        setDisabledButs(false);

  }

    return(
    <>
      <Header />
      <h1>{t("BatchInsert")}</h1>
      <Container component="main" maxWidth="md">
        <div className={DTRoot}>
            <Grid container spacing={1} alignItems="center">

        <XlsFile sheetIndex={0} setJsonText={setJsonText} label={"Metadata file (.xlsx format)"}/>
          <UploadNew assets={assets} show={false} setAssets={setAssets} setDisabledButs={setDisabledButs} label={t("dossier:LoadJpgs")} />
                <Grid item xs={12}> {" "} &nbsp; </Grid>
      </Grid>

          <form onSubmit={handleSubmit(onBatchSubmit)} >
            <Grid container spacing={1} alignItems="center">

              <Grid item xs={12}> {" "} &nbsp; </Grid>

              <MostSubmitButton disabled={disabledButs} label={t("dossier:Inserisci")} />
            </Grid>
          </form>
        </div>
      </Container>
      <Footer />
    </>
  )
};
