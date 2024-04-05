import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

import {Ed25519KeyIdentity} from '@dfinity/identity';
import {HttpAgent} from '@dfinity/agent';
import {AssetManager} from '@dfinity/assets';
//import Masonry from "react-masonry-css";

import { MostAutocomplete, MostSubmitButton, MostCheckbox, MostSelect, MostTextField, } from "./components/MostComponents";
// import { FileUpload } from "./components/FileUpload";
// import FormDialog from "./components/FormDialog";
import { useGlobalState } from './state';
import { DTRoot } from "./components/useStyles";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { backend } from "../../declarations/backend";

export const NewDossier = () => {
  const navigate = useNavigate();
  const { username } = useGlobalState('username');
  const { application } = useGlobalState('application');
//  const { control, register, handleSubmit, errors, setValue } = useForm();
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [disabledButs, setDisabledButs] = useState(false)
  const [newDossierInfo, setNewDossierInfo] = useState({}); //pull down & C.
  const [searchele, setSearchele] = useState(false); 
  const [lastInsert, setLastInsert] = useState(null); 
  const { t } = useTranslation(["translation", "dossier"]);
  const [uploadInfo, setUploadInfo] = useState(null);
  const [uploadInfoSignatures, setUploadInfoSignatures] = useState(null);
  const [action, setAction] = useState("");
  const [assetKey, setAssetKey] = useState("");

// Hardcoded principal: 535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe
// Should be replaced with authentication method e.g. Internet Identity when deployed on IC
const identity = Ed25519KeyIdentity.generate(new Uint8Array(Array.from({length: 32}).fill(0)));
const isLocal = !window.location.host.endsWith('ic0.app');
const agent = new HttpAgent({
    host: isLocal ? `http://127.0.0.1:${window.location.port}` : 'https://ic0.app', identity,
});
if (isLocal) {
    agent.fetchRootKey();
}

// Canister id can be fetched from URL since frontend in this example is hosted in the same canister as file upload
// const canisterId = new URLSearchParams(window.location.search).get('canisterId') ?? /(.*?)(?:\.raw)?\.ic0.app/.exec(window.location.host)?.[1] ?? /(.*)\.localhost/.exec(window.location.host)?.[1];
const canisterId = process.env.CANISTER_ID_BACKEND;

// Create asset manager instance for above asset canister
const assetManager = new AssetManager({canisterId, agent});

// Get file name, width and height from key
const detailsFromKey = (key) => {
    const fileName = key.split('/').slice(-1)[0];
    const width = parseInt(fileName.split('.').slice(-3)[0]);
    const height = parseInt(fileName.split('.').slice(-2)[0]);
    return {key, fileName, width, height}
}

// Get file name, width and height from file
const detailsFromFile = async (file) => {
    const src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    })
    const [width, height] = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve([img.naturalWidth, img.naturalHeight]);
        img.src = src;
    })
    const name = file.name.split('.');
    const extension = name.pop();
    const fileName = [name, width, height, extension].join('.');
    return {fileName, width, height}
}


  const appAlert = useCallback((text) => {
    alert(text);
  }, [])

  useEffect(() => {
    setSearchele(false);
    //let res = {};
    // MyAxios.get("dossier_info").then((response) => {
    let QP = {
        offset: 0,
        limit:50,
        autore: 'Elisabetta Villa'
    };
    backend.dossier_query(QP).then((Ok_data) =>  {
        console.log("dossieropera returns: ",JSON.stringify(Ok_data));
        let data = JSON.parse(Ok_data.Ok);

        let response = {}
      let translated="";
      let rows="";
      let ar_id="";
      // let custom_list = ["autore", "luogoopera", "tipoopera"]; //elenco pull down da customizzare
      let custom_list = []; //elenco pull down da customizzare
      custom_list.forEach((ar) => {
        console.log(ar);
        rows = [];
        ar_id = response[ar]; //array con id (che uso) e description (che ignoro)
        ar_id.forEach((r) => {
            //console.log(r);
            if (ar === "autore") {
              translated = `${r.nome} ${r.cognome} (${r.nomeinarte})`;
            } else if (ar === "tipoopera") {
              translated = r.description
            } else {
              let tipoluogo="";
              if (r.tipoluogo_id)
                tipoluogo=t("dossier:tipoluogo_id." + r.tipoluogo_id);
              translated = `${r.indirizzo},  ${r.citta}, ${r.nazione} (${tipoluogo})`;
            }
          rows.push({ "value": r.id, "label": translated });
        });
        response[ar] = rows; // sotituisco il suboggetto con quello nuovo, con righe {value: xx, label:yy}
        console.log(response[ar]);
      });
      // let translate_list = ["statusopera", "fruibilitadossier", "fruibilitaopera", "tipoluogo", "tiposupporto"]; //elenco pull down da nazionalizzare
      let translate_list = []; //elenco pull down da nazionalizzare
      translate_list.forEach((ar) => {
        console.log(ar);
        rows = [];
        ar_id = response[ar]; //array con id (che uso) e description (che ignoro)
        ar_id.forEach((r) => {
          // tabelle con chiave numerica
          if (ar === "fruibilitadossier") {
            translated = t("dossier:" + ar + "_id." + r.code);
          } else {
            translated = t("dossier:" + ar + "_id." + r.id);
          }
          rows.push({ "value": r.id, "label": translated });
        });
        response[ar] = rows; // sotituisco il suboggetto con quello nuovo, con righe {value: xx, label:yy}
      });
      //console.log(response);
      setNewDossierInfo(response);
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
    console.log("onSubmit: " + JSON.stringify(vals));
    if (assetKey == "") {
        appAlert("File immagine non scelto")
        return
    }
    // if (!uploadInfoSignatures) {
        // appAlert("File delle firme non scelto")
        // return
    // }
      if (false) {
    let formData = new FormData();
    console.log("onSubmit file2: " + JSON.stringify(uploadInfo[0]));
    formData.append("document_file", uploadInfo[0]);
    if (uploadInfoSignatures) 
      formData.append("signatures_file", uploadInfoSignatures[0]);
    formData.append("jpayload", JSON.stringify(vals));
      }

      vals.ora_inserimento = new Date();
      vals.username = "pippo";
      vals.autore = "Elisabetta Villa";
      // vals.icon_uri = "https://techne-test.mostapps.it/ipfs/QmeAV99r5LckFBAJxu5FUwhpMWjQ9XCSRd5cSC2w3k5vWJ" ;
      vals.icon_uri = assetKey;
    setDisabledButs(true)
    backend.dossier_insert(JSON.stringify(vals)).then((Ok_data) =>  {
        console.log("dossier_insert returns: ",JSON.stringify(Ok_data));
        let response = JSON.parse(Ok_data.Ok);
//     MyAxios.post("/newdossier", formData, { headers: { "Content-Type": "multipart/form-data; boundary=ZZZZZZZZZZZZZZZZZZZ", }, }) .then((response) => { response = check_response(response);
        // alert(JSON.stringify(response));
        //console.log(response);
        if (response.success) {
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

    const [uploads, setUploads] = useState([]);
    const [progress, setProgress] = useState(null);

    useEffect(() => {
        assetManager.list()
            .then(assets => assets
                .filter(asset => asset.key.startsWith('/uploads/'))
                .sort((a, b) => Number(b.encodings[0].modified - a.encodings[0].modified))
                .map(({key}) => detailsFromKey(key)))
            .then(setUploads);
    }, []);

    const uploadPhotos = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = async () => {
            setProgress(0);
            try {
                const batch = assetManager.batch();
                const items = await Promise.all(Array.from(input.files).map(async (file) => {
                    const {fileName, width, height} = await detailsFromFile(file);
                    const key = await batch.store(file, {path: '/uploads', fileName});
                    return {key, fileName, width, height};
                }));
                console.error("preawait");
                await batch.commit({onProgress: ({current, total}) => setProgress(current / total)});
                console.error("postawait");
                setUploads(prevState => [...items, ...prevState])
                console.error("postsetUploads");
                console.error("uploads: ", JSON.stringify(uploads));
                console.error("items: ", JSON.stringify(items));
                setAssetKey(items[0].key);
            } catch (e) {
                if (e.message.includes('Caller is not authorized')) {
                    alert("Caller is not authorized, follow Authorization instructions in README");
                } else {
                    throw e;
                }
            }
            setProgress(null)
        };
        input.click();
    }

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
                    <button className={'App-upload'} onClick={uploadPhotos}>📂 Upload photo</button>
          <form onSubmit={handleSubmit(onSubmit)} noValidate >
            {application == "elivilla" ?  (
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12}>
                    <MostTextField name="nomeopera" required={true} label={t("dossier:evento")} register={register({ required: true })} />
                    {errors.nomeopera && <span className="badValue">{t("campo obbligatorio")}</span>}
                </Grid>
                <Grid item xs={12}>
                    <MostTextField name="celebrity" required={true} label={t("dossier:celebrity")} register={register({ required: true })} />
                    {errors.nomeopera && <span className="badValue">{t("campo obbligatorio")}</span>}
                </Grid>
                <Grid item xs={12}>
                    <MostTextField name="year" type="number" min={1980} max={2040} defaultValue={2023} label={t("dossier:year")} register={register({ required: false })} />
                </Grid>
                <Grid item xs={12}>
                    <MostAutocomplete control={control} name="action" rules={{ required: true }} options={newDossierInfo.action} label={t("dossier:CreaNFT")+ " *"} onChange={actionChange} />
                </Grid>
              </Grid>

            ) : ( application == "cottolengo" || application == "hypnos"?  (
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12}>
                    <MostTextField name="nomeopera" required={true} label={t("dossier:Luogo o personaggio")} register={register({ required: true })} />
                    {errors.nomeopera && <span className="badValue">{t("campo obbligatorio")}</span>}
                </Grid>
                <Grid item xs={12}>
                    <MostAutocomplete control={control} name="action" rules={{ required: true }} options={newDossierInfo.action} label={t("dossier:CreaNFT")+ " *"} onChange={actionChange} />
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12}>
                    <MostTextField name="nomeopera" required={true} label={t("dossier:nomeopera")} register={register({ required: true })} />
                    {errors.nomeopera && <span className="badValue">{t("campo obbligatorio")}</span>}
                </Grid>

                <Grid item xs={12}>
                    <MostSelect name="fruibilitaopera" options={newDossierInfo.fruibilitaopera} control={control} placeholder={t("dossier:FruibilitaOpera")} />
                </Grid>
                <Grid item xs={6}>
                  <MostSelect control={control} name="luogoopera" options={newDossierInfo.luogoopera} placeholder={t("dossier:luogoopera")} />
                </Grid>
                <Grid item xs={3}>
                  <MostCheckbox register={register} control={control} name="riservatezzaluogo" default={false} label={t("dossier:riservato")} />
                </Grid>
                <Grid item xs={3}>
                  <FormDialog what="luogo" tipoluogoOptions={newDossierInfo.tipoluogo} setSearchele={setSearchele} disabledButs={disabledButs} onInsert={onInsert} control={control} />
                </Grid>
                <Grid item xs={9}>
                  <MostSelect name="statusopera" options={newDossierInfo.statusopera} control={control} placeholder={t("dossier:statusopera")} />
                </Grid>
                <Grid item id="tiposupporto_id" xs={12}>
                    <MostSelect name="tiposupporto_id" rules={{ required: false }} options={newDossierInfo.tiposupporto} control={control} placeholder={t("dossier:TipoSupporto")+" *"} />
                    {errors.tiposupporto_id && <span className="badValue">{t("campo obbligatorio")}</span>}
                </Grid>
                <Grid item xs={3}>
                  <MostCheckbox register={register} control={control} name="riservatezzastatus" default={false} label={t("dossier:riservato")} />
                </Grid>
                <Grid item xs={9} className="asinistra blackColor">
                   <span className="padding10">{t("dossier:Proprietario")}: {username}</span>
                </Grid>
                <Grid item xs={3}>
                    <MostCheckbox register={register} control={control} name="riservatezzaproprietario" default={false} label={t("dossier:riservato")} />
                </Grid>
                <Grid item xs={12}>
                    <MostSelect name="fruibilitadossier" rules={{ required: false }} options={newDossierInfo.fruibilitadossier} control={control} placeholder={t("dossier:fruibilitadossier")+" *"} />
                    {errors.fruibilitadossier && <span className="badValue">{t("campo obbligatorio")}</span>}
                </Grid>


              </Grid>
            ))}
                {action == "" ? (
                  <div></div>
                ) : ( action == "tokenize" ? (
                <Grid item xs={12}>
                    <MostSelect control={control} name="grid_size" options={newDossierInfo.grid_size} placeholder={t("dossier:GridSize")+ " *"} />
                </Grid>
                ) : (
                <div>
                <Grid item xs={12}>
                    <MostTextField name="copies" type="number" label={t("dossier:NumeroCopie" + " *")} register={register({ required: true })} />
                </Grid>
                <Grid item xs={12}>
                    <MostSelect control={control} name="signature_position" options={newDossierInfo.signature_position} placeholder={t("dossier:SignaturePosition")+ " *"} register={register({ required: true })} />
                </Grid>
                <Grid item xs={12}>
                    <MostSelect control={control} name="signature_color" options={newDossierInfo.signature_color} placeholder={t("dossier:SignatureColor")+ " *"} register={register({ required: true })} />
                </Grid>
                <Grid item xs={6} >
                  Specimen di firma:
                </Grid>
                <Grid item xs={6} >
                  <FileUpload setUploadInfo={setUploadInfoSignatures} />
                </Grid>
                </div>
                ) 
                )}
                {action == "cottolengo" ? (
                  <></>
                ) : (
                <Grid item xs={3}>
                  <MostCheckbox register={register} control={control} name="extract_frames" default={false} label={t("dossier:extract_frames")} />
                </Grid>
                )}

              <Grid container spacing={1} alignItems="center">
                <Grid item xs={9}>
                  <MostSelect control={control} name="autore" rules={{ required: false }} options={newDossierInfo.autore} placeholder={t("dossier:autore")+" *"} />
                  {errors.autore && <span className="badValue">{t("campo obbligatorio")}</span>}
                </Grid>
                <Grid item xs={3}>
                  <FormDialog what="autore" setSearchele={setSearchele} disabledButs={disabledButs} onInsert={onInsert} className="MuiFormControl-marginDense"/>
                </Grid>

                <Grid item xs={9}>
                  <MostSelect control={control} name="tipoopera_id" rules={{ required: false }} options={newDossierInfo.tipoopera} placeholder={t("dossier:TipoOpera")+ " *"} />
                  {errors.tipoopera_id && <span className="badValue">{t("campo obbligatorio")}</span>}
                </Grid>
                <Grid item xs={3}>
                  <FormDialog what="tipoopera" setSearchele={setSearchele} disabledButs={disabledButs} onInsert={onInsert} className="MuiFormControl-marginDense"/>
                </Grid>


              </Grid>



                <Grid item xs={12}>   &nbsp;</Grid>

            <MostSubmitButton disabled={disabledButs} label={t("dossier:Inserisci")} />
          </form>
        </div>
      </Container>
      <Footer />
    </div>
  );
};
