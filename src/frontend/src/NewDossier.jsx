import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Autocomplete from "@mui/material/Autocomplete";


import { MyTextField, MyCheckbox, MyAutocomplete, MostSubmitButton, MostCheckbox, MostSelect, MostTextField, } from "./components/MostComponents";
import { useGlobalState } from './state';
import { DTRoot } from "./components/useStyles";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Upload } from "./Upload";
import { backend } from "../../declarations/backend";

export const NewDossier = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useGlobalState('username');
  const [application, setapplication] = useGlobalState('application');
  const { control, register, handleSubmit, watch, formState: { errors }, } = useForm()
  const [disabledButs, setDisabledButs] = useState(true)
  const [newDossierInfo, setNewDossierInfo] = useState({}); //pull down & C.
  const [searchele, setSearchele] = useState(false); 
  const [lastInsert, setLastInsert] = useState(null); 
  const { t } = useTranslation(["translation", "dossier"]);
  const [uploadInfo, setUploadInfo] = useState(null);
  const [uploadInfoSignatures, setUploadInfoSignatures] = useState(null);
  const [action, setAction] = useState("");
  const [assetKey, setAssetKey] = useState("");
  const [privateDossier, setPrivateDossier] = useState(false);
  const [nomeOpera, setNomeOpera] = useState("");
  const [autore, setAutore] = useState("");
  const autoreOptions=[
      {'code': 'uno', 'label': 'pippo'}, 
      {'code': 'due', 'label': 'pluto'}, 
      ];
  // const selectedAutore = React.useMemo( () => autoreOptions.filter((v) => v.selected), [autoreOptions],);

  const [luogo, setLuogo] = useState("");
  const luogoOptions=[
      {'code': 'uno', 'label': 'Luogo1'}, 
      {'code': 'due', 'label': 'Luogo2'}, 
      ];


  const appAlert = useCallback((text) => {
    alert(text);
  }, [])

  useEffect(() => {
    setSearchele(false);
    //let res = {};
    // MyAxios.get("dossier_info").then((response) => {
    let XXQP = {
        offset: 0,
        limit:50,
        // autore: 'Elisabetta Villa'
    };
    backend.dossier_pulldowns().then((Ok_data) =>  {
        console.log("dossieropera returns: ",JSON.stringify(Ok_data));
        let data = JSON.parse(Ok_data.Ok);
      let pulldowns = {
          autori: data.autori,
          luogooperas: data.luogooperas
      }
        console.log("struct pulldowns: ",JSON.stringify(pulldowns));
      setNewDossierInfo(pulldowns);
      if(lastInsert && lastInsert.what === "autore" && response["autore"]) {
        response["autore"].forEach((r) => {
            if (r.value === lastInsert.id) {
                setValue('autore',r, { shouldValidate: true })
                setLastInsert(null)
            }
        })
      }
      if(lastInsert && lastInsert.what === "tipoopera" && response["tipoopera"]) {
        response["tipoopera"].forEach((r) => {
            if (r.value === lastInsert.id) {
                setValue('tipoopera_id',r)
                setLastInsert(null)
            }
        })
      }
      if(lastInsert && lastInsert.what === "luogo" && response["luogoopera"]) {
        response["luogoopera"].forEach((r) => {
            if (r.value === lastInsert.id) {
                setValue('luogoopera',r)
                setLastInsert(null)
            }
        })
      }
    })
    .catch(function (error) {
        console.error(error);
        appAlert(error.message?error.message:JSON.stringify(error));
    });
  }, [t, searchele, appAlert, lastInsert]);

  const actionChange = (e, el) => {
    console.error (JSON.stringify(el));
    setAction(el.value);
  }

  const onInsert = (what,id) => {
    setLastInsert({what:what, id:id})
  }


  const onSubmit = (vals) => {
    if (assetKey == "") {
        appAlert("File immagine non scelto")
        return
    }

      vals.ora_inserimento = new Date();
      vals.username = username;
      vals.autore = autore;
      vals.luogoopera = luogo;
      vals.nomeopera = nomeOpera;
      if (privateDossier === null ||privateDossier  == false) {
        vals.private=false;
      } else {
        vals.private = true;
      }
      vals.icon_uri = assetKey;
    setDisabledButs(true)
      console.log("onSubmit: ", JSON.stringify(vals));
    backend.dossier_insert(JSON.stringify(vals)).then((Ok_data) =>  {
        console.log("dossier_insert returns: ",JSON.stringify(Ok_data));
        let response = JSON.parse(Ok_data.Ok);
        console.log(response);
        if (response) {
          setDisabledButs(true)
          navigate("/dossier");
        } else {
          console.error(response);
          appAlert(response.error);
          setDisabledButs(false)
        }
      })
      .catch(function (error) {
        console.error(error);
        appAlert(error.message?error.message:JSON.stringify(error));
        setDisabledButs(false)
      })
  };

    console.log("newDossierInfo: ", JSON.stringify(newDossierInfo));
    console.log("newDossierInfo: ", JSON.stringify(newDossierInfo.autori));
  return (
    <div>
      <Header />
      {application == "elivilla" ?  (
        <h1>{t("dossier:NewCelebrity")}</h1>
      ) : ( application == "techne" ?  (
          <h1>{t("dossier:NewArtwork")}</h1>
      ) : ( application == "hypnos" ?  (
          <h1>{t("dossier:NewPainting")}</h1>
      ) : ( application == "cottolengo" ?  (
          <h1>{t("dossier:NewDrawing")}</h1>
        ) : (
          <h1>{t("dossier:NewDossier")}</h1>
        )
      )
      )
      )}
      <Container component="main" maxWidth="md">
        <div className={DTRoot}>
          <Upload assetKey={assetKey} setAssetKey={setAssetKey} setDisabledButs={setDisabledButs} />


          <form onSubmit={handleSubmit(onSubmit)}>

                    <Grid container spacing={1} alignItems="center">

      <Grid item xs={12}>
                          <MyTextField name="nomeopera" required={true} label={t("dossier:nomeopera")} onChange={(e) => setNomeOpera(e.target.value)}  />

                </Grid>
                <Grid item xs={12}>
                  <MyAutocomplete name="autore" label={t("dossier:autore")} options={newDossierInfo.autori} value={autore} onInputChange={(e,v) => setAutore(v)}/>
                </Grid>
                <Grid item xs={12}>
                  <MyAutocomplete name="luogoopera" label={t("dossier:luogoopera")} options={newDossierInfo.luogooperas} onInputChange={(e,v) => setLuogo(v)}/>
                </Grid>


                <Grid item xs={3}>
                <MyCheckbox defaultChecked={false} onChange={(e,v) => setPrivateDossier(v.label)}/>

                </Grid>

                <Grid item xs={12}>   &nbsp;</Grid>

      <MostSubmitButton disabled={disabledButs} label={t("dossier:Inserisci")} />


      </Grid>
          </form>
        </div>
      </Container>
      <Footer />
    </div>
  );
};
