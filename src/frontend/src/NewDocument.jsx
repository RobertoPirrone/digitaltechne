import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropagateLoader from "react-spinners/PropagateLoader";
// import { css } from "@emotion/core";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
// import { FileUpload } from "./components/FileUpload";
import { DocData } from "./components/DocData";
import { DTRoot, DTSubmit } from "./components/useStyles";
//import MyAxios, { check_response } from "./MyAxios";
import Grid from "@mui/material/Grid";
import { GoToHomePage } from "./components/OpusComponents";

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
  const navigate = useNavigate();
  let react_router_location = useLocation();
  let dossier_id
  if (props.location.state)
    dossier_id = props.location.state.dossier_id;
  else
    dossier_id = react_router_location.pathname.split("/")[2];

  const { t } = useTranslation(["translation", "documento"]);
  const [loading, setLoading] = useState(false);
  const spinnerCss = css`
    display: block;
    margin: 0 auto;
  `;
  const [disabledButs, setDisabledButs] = useState(false)
  const [uploadInfo, setUploadInfo] = useState(null);
  const [dossierInfo, setDossierInfo] = useState(null);
  const [docs, setDocs] = useState([]);
  const { control, register, handleSubmit, errors, setValue } = useForm();
  const { setAlert1, setContent } = useGlobalHook("alertStore");
  const appAlert = useCallback((text) => {
    setContent(text);
    setAlert1(true);
  }, [setContent,setAlert1])
  const { setConfirm1, setCContent, setOnConfirm } = useGlobalHook('confirmStore');
  function appConfirm(text,okHandler) {
      setCContent(text);
      setOnConfirm(() => x => {
        okHandler();
      });
      setConfirm1(true);
  }

  useEffect(() => {
    if(!dossier_id)
        return
    let jdata = { dossier_id: dossier_id };
    MyAxios.post("/documents", jdata).then((response) => {
      response = check_response(response);
      if (!response.success) {
        appAlert(response.error)
        setDisabledButs(true)
        return
      }
      //console.log("/documents response:" + JSON.stringify(response));
      let data = response;
      setDossierInfo(data.dossierInfo);
      setDocs(data.rows)
    })
    .catch(function (error) {
        console.error(error);
        appAlert(error.message?error.message:JSON.stringify(error));
    });
  }, [appAlert,dossier_id]);

  const onSubmit = (vals) => {
    console.log("Entro onSubmit: " + JSON.stringify(vals));
    if (!uploadInfo) {
        appAlert("File non scelto")
        return
    }
    vals["dossieropera_id"] = dossier_id;

    console.log("onSubmit uploadInfo: " + uploadInfo);
    console.log("onSubmit: " + JSON.stringify(vals));
    //alert("onSubmit: " + JSON.stringify(vals));

    const sep = "|"
    const att = vals.author.trim()+sep+vals.title.trim()+sep+vals.tassonomiadocumenti.value
    let versione = 0
    for (let i in docs) {
        console.log(docs[i])
        if(docs[i].author+sep+docs[i].title+sep+docs[i].tassonomiadocumenti_id === att) {
            if(docs[i].versione > versione) {
                versione = docs[i].versione
            }
        }
    }
    if(versione) {
        versione++
        const text = "Documento già presente. Inserimento della versione n. "+versione+" ?"
        appConfirm(text,() => {
            doSubmit(vals,versione)
        })
    } else {
        doSubmit(vals,1)
    }
  }

  const doSubmit = (vals,versione) => {
    vals["versione"] = versione
    console.log("doSubmit", vals)
    let formData = new FormData();

    formData.append("upload", uploadInfo[0]);
    formData.append("author", vals.author);
    formData.append("dossieropera_id", dossier_id);
    formData.append("title", vals.title);
    formData.append("versione", vals.versione);
    formData.append(
      "accessibilitadocumenti",
      vals.accessibilitadocumenti.value
    );
    formData.append("tassonomiadocumenti", vals.tassonomiadocumenti.value);

    setDisabledButs(true)
    setLoading(true)
    MyAxios.post("/newdoc2", formData, {
      headers: {
        "Content-Type": "multipart/form-data; boundary=ZZZZZZZZZZZZZZZZZZZ",
      },
    })
      .then((response) => {
        response = check_response(response);
        // alert(JSON.stringify(response));
        //console.log(response);
        if (response.success) {
          let url = "/dossierdetail/" + dossier_id;
          navigate(url);
        } else {
          console.error(response);
          appAlert(response.error);
          setDisabledButs(false)
          setLoading(false)
        }
      })
      .catch(function (error) {
        // handle error
        console.error(error);
        appAlert(error.message ? error.message : JSON.stringify(error));
        setDisabledButs(false)
        setLoading(false)
      })
  };

  // manca parametro alla url
  if (!dossier_id) {
    return <GoToHomePage />
  }

  return (
    <div>
      <Header />
      <h1> {t("documento:NewDocument")} </h1>
        {dossierInfo ? (
          <Container component="main" maxWidth="md">
            <table className="ethTable">
            <tbody>
               <tr>
                <td className="w200">{t('documento:Nome')}</td>
                <td>{dossierInfo.nomeopera}</td>
               </tr>
               <tr>
                <td className="w200">{t('documento:Autore')}</td>
                <td>{dossierInfo.autoredetail.nome} {dossierInfo.autoredetail.cognome} ({dossierInfo.autoredetail.nomeinarte}) </td>
               </tr>
            </tbody>
            </table>
          </Container>
            ) : null }
      <Container component="main" maxWidth="md">
        <div className={DTroot}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} className="top-margin-10">
                <FileUpload
                  setUploadInfo={setUploadInfo}
                  className="top-margin-10"
                />
              </Grid>
              <DocData
                t={t}
                register={register}
                errors={errors}
                setValue={setValue}
                control={control}
              />
              <Button
                type="submit"
                disabled={disabledButs}
                fullWidth
                variant="contained"
                color="primary"
                className={DTsubmit}
              >
                {t("Inserisci")}
              </Button>
              <div className="width100">
              <PropagateLoader color="#AAAA00" css={spinnerCss} loading={loading} />
              </div>
            </Grid>
          </form>
        </div>
      </Container>
      <Footer />
    </div>
  );
};
