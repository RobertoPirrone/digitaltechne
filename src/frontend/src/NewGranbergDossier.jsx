import React, { useState, useEffect, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Autocomplete from "@mui/material/Autocomplete";
import { v4 as uuidv4 } from 'uuid';

import { MyTextField, MyCheckbox, MyAutocomplete, MostSubmitButton, MostCheckbox, MostSelect, MostTextField } from "./components/MostComponents";
import { SpecializedSelect} from "./components/SpecializedSelect";

import { useGlobalState } from "./state";
import { DTRoot } from "./components/useStyles";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Upload } from "./Upload";
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
    if (backendActor === null) {
      navigate("/login");
    } else {
      backendActor
        .dossier_pulldowns()
        .then((Ok_data) => {
          console.log("dossieropera returns: ", JSON.stringify(Ok_data));
          let data = JSON.parse(Ok_data.Ok);
          let pulldowns = {
            autori: data.autori,
          };
          console.log("struct pulldowns: ", JSON.stringify(pulldowns));
          setNewDossierInfo(pulldowns);
          if (lastInsert && lastInsert.what === "autore" && response["autore"]) {
            response["autore"].forEach((r) => {
              if (r.value === lastInsert.id) {
                setValue("autore", r, { shouldValidate: true });
                setLastInsert(null);
              }
            });
          }
        })
        .catch(function (error) {
          console.error(error);
          appAlert(error.message ? error.message : JSON.stringify(error));
        });
    }
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
    vals.autore = "Liliana Granberg";
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
    vals.icon_uri = asset.key;
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
          <Upload asset={asset} show={true} setAsset={setAsset} setDisabledButs={setDisabledButs} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12}> <MyTextField name="nomeopera" required={true} label={t("dossier:nomeopera")} onChange={(e) => setNomeOpera(e.target.value)} /> </Grid>
              <Grid item xs={12}> <SpecializedSelect defaultValue={""} name="tipotecnica" label={t("tipotecnica:Label")} what={"tipotecnica"} onChange={(e, v) => setTipotecnica(e.target.value)} /> </Grid>
              <Grid item xs={12}> <MyTextField name="annoopera" required={true} label={t("dossier:annoopera")} onChange={(e) => setAnnoopera(e.target.value)} /> </Grid>
              <Grid item xs={12}> <MyTextField name="numero_totale_copie" required={true} label={t("dossier:numero_totale_copie")} onChange={(e) => setNumero_totale_copie(e.target.value)} /> </Grid>
              <Grid item xs={12}> <MyTextField name="dimensions" required={true} label={t("dossier:dimensions")} onChange={(e) => setDimensions(e.target.value)} /> </Grid>
              <Grid item xs={12}> <SpecializedSelect defaultValue={""} name="tipofirma" label={t("tipofirma:Label")} what={"tipofirma"} onChange={(e, v) => setTipofirma(e.target.value)} /> </Grid>
              <Grid item xs={12}> <SpecializedSelect defaultValue={""} name="tiposupporto" label={t("tiposupporto:Label")} what={"tiposupporto"} onChange={(e, v) => setTiposupporto(e.target.value)} /> </Grid>

              <Grid item xs={3}> <text>Private</text> <MyCheckbox defaultChecked={false} onChange={(e, v) => setPrivateDossier(v.label)} /> </Grid>
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
