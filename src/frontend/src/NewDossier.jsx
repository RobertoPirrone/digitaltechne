import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
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
// import { uploads, canisterId as uploads_id } from "../../declarations/uploads";

export const NewDossier = () => {
  const navigate = useNavigate();
    const [username, setUsername] = useGlobalState('username');
    const [application, setapplication] = useGlobalState('application');
    console.log("username entro: ", username, ", application: ", application);
//  const { control, register, handleSubmit, errors, setValue } = useForm();


    const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()



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

            if (false) {
        const agent = new HttpAgent({
            host: isLocal ? `http://127.0.0.1:${window.location.port}` : 'https://ic0.app', identity,
        });
        if (isLocal) {
            agent.fetchRootKey();
        }
        }

// Canister id can be fetched from URL since frontend in this example is hosted in the same canister as file upload
// const canisterId = new URLSearchParams(window.location.search).get('canisterId') ?? /(.*?)(?:\.raw)?\.ic0.app/.exec(window.location.host)?.[1] ?? /(.*)\.localhost/.exec(window.location.host)?.[1];
// const canisterId = process.env.CANISTER_ID_ASSETS;
const canisterId = 'dmalx-m4aaa-aaaaa-qaanq-cai';
const asset_pfx = `http://${canisterId}.localhost:4943`;

// Create asset manager instance for above asset canister
// const assetManager = new AssetManager({canisterId, agent});
const agent = new HttpAgent({
    host: isLocal ? `http://127.0.0.1:4943` : 'https://ic0.app', identity,
});
const assetManager = new AssetManager({canisterId, agent});
if (isLocal) {
    agent.fetchRootKey();
}

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
    console.log("dataUpload: " + JSON.stringify(vals));
    if (assetKey == "") {
        appAlert("File immagine non scelto")
        return
    }
    // if (!uploadInfoSignatures) {
        // appAlert("File delle firme non scelto")
        // return
    // }

      console.log("onSubmit username: ", username);
      vals.ora_inserimento = new Date();
      vals.username = username;
      vals.autore = "Elisabetta Villa";
      // vals.icon_uri = "https://techne-test.mostapps.it/ipfs/QmeAV99r5LckFBAJxu5FUwhpMWjQ9XCSRd5cSC2w3k5vWJ" ;
      vals.icon_uri = assetKey;
    setDisabledButs(true)
      console.log("onSubmit: ", JSON.stringify(vals));
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
                const upload_items = await assetManager.list();
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
          <div key={`${asset_pfx}${assetKey}`} className={'App-image'} >
            <img src={`${asset_pfx}${assetKey}`} width= {'100%'}  loading={'lazy'}/>
          </div>
                  {progress !== null && <div className={'App-progress'}>{Math.round(progress * 100)}%</div>}


          <form onSubmit={handleSubmit(onSubmit)}>

                    <Grid container spacing={1} alignItems="center">

      <Grid item xs={12}>
                    <input {...register("nomeopera", { required: true })} label={t("dossier:nomeopera")} />
                </Grid>


                <Grid item xs={3}>
                  <MostCheckbox {...register('nomeopera')}  name="extract_frames" default={false} label={t("dossier:extract_frames")} />
                </Grid>

                <Grid item xs={12}>   &nbsp;</Grid>
                        <input type="submit" />


      </Grid>
          </form>
        </div>
      </Container>
      <Footer />
    </div>
  );
};
