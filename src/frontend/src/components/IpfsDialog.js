import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGlobalHook } from "@devhammed/use-global-hook";
// import { ECIESdecryptAesKeyB64, AESdecrypt1, ZLIBinflate } from "../Crypto";
import { downloadArrayBuffer } from "../Utils";
import { MostButton2 } from "./MostComponents";
import MyAxios from "../MyAxios";

/**
 * IpfsDialog: bottone per download di un file che si trova in IPFS
 *
 * @component
 * @param {string} hash identifier in IPFS
 * @example
 * const hash = 'Qmxxxx'
 * return (
 *   <Button />
 * )
 */
function IpfsDialog(props) {
  const { t } = useTranslation(["documento", "translation"]);
  const history = useHistory();
  const { setAlert1, setContent } = useGlobalHook("alertStore");
  function appAlert(text) {
    setContent(text);
    setAlert1(true);
  }

  const handleClickOpen = () => {
    // documento crittografato e chiave non disponibile
    if (props.info.accessibilitadocumenti_id !== 0 && !sessionStorage.getItem("eciesPrivateKey")) {
      history.push("/openKey");
    } else {
      handleDownload();
    }
  };

  /**
   * scarico vero e proprio
   *
   * @memberOf IpfsDialog
   */
  const handleDownload = () => {
    const hash = props.info.hashipfs;
    const filename = props.info.filename;
    const aesEncryptedKey = props.info.aes_crypted_key;
    const mimetype = props.info.mimetype;
    const url = "/ipfs/" + hash;
    props.setDisabledButs(true);
    MyAxios.get(url, {
      baseURL: process.env.REACT_APP_IPFS,
      responseType: "blob",
      headers: {
        "Content-Type": "multipart/form-data; boundary=ZZZZZZZZZZZZZZZZZZZ",
      },
    })
      .then(async (response) => {
        console.log("recuperato file");
        try {
          downloadArrayBuffer(response.data, filename, mimetype);
        } catch (error) {
          console.error(error);
          appAlert(error.message ? error.message : JSON.stringify(error));
        }
        /*
      //console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data],{type:response.data.type}));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); //or any other extension
      document.body.appendChild(link);
      link.click();
      */
      })
      .catch(function (error) {
        if (window.location.href.indexOf("localhost") !== -1) {
          appAlert("IPFS non raggiungibile (CORS)");
        } else {
          console.error(error);
          appAlert(error.message ? error.message : JSON.stringify(error));
        }
      })
      .then(function () {
        props.setDisabledButs(false);
      });
    return "";
  };

  return <MostButton2 disabled={props.disabledButs} onClick={handleClickOpen} label={t("documento:download")} />;
}
export default IpfsDialog;
