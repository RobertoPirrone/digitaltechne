import React, { useEffect, useState, useCallback } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
//import TextField from "@material-ui/core/TextField";
// import { useGlobalHook } from '@devhammed/use-global-hook'
import Grid from "@mui/material/Grid";
import { MostTextField } from "./MostComponents";

/**
 * Form inserimento metadati del documento
 * @component
 */
export const DocData = (props) => {
  const [newDocInfo, setNewDocInfo] = useState({}); //pull down & C.
  const [tassonomiaOptions, setTassonomiaOptions] = useState([]);

  const { setAlert1, setContent } = useGlobalHook('alertStore');
  const appAlert = useCallback((text) => {
    setContent(text);
    setAlert1(true);
  }, [setContent,setAlert1])

  useEffect(() => {
    //let res = {};
    MyAxios.get("document_info").then((response) => {
      response = check_response(response);
      if  (!response.success) {
        //console.log(response);
        appAlert(response.error);
        return;
      }
      //console.log(response);
      let arr_list = ["accessibilitadocumenti", "tassonomiadocumenti", "categoriadocumenti"]; //elenco pull down da nazionalizzare
      let translated = "";
      arr_list.forEach((ar) => {
        let rows = [];
        // andiamo a modificare la response: pessima scelta
        // nei log js non si vede più il messaggio originale ma quello modificato
        let ar_id = response[ar]; //array con id (che uso) e description (che ignoro)
        ar_id.forEach((r) => {
          // campi che hanno chiave numerica
          if (ar === "accessibilitadocumenti" || ar === "tassonomiadocumenti") {
            translated = props.t("documento:" + ar + "_id." + r.code);
          } else {
            translated = props.t("documento:" + ar + "_id." + r.id);
          }
          if (ar === "tassonomiadocumenti")
            rows.push({ value: r.id, label: translated, categoriadocumenti_id: r.categoriadocumenti_id});
          else
            rows.push({ value: r.id, label: translated });
        });
        response[ar] = rows; // sotituisco il suboggetto con quello nuovo, con righe {value: xx, label:yy}
      });
      //console.log(response);
      setNewDocInfo(response);
    })
    .catch(function (error) {
        console.error(error);
        appAlert(error.message?error.message:JSON.stringify(error));
    });
  }, [props,appAlert]);

  const cambioCategoria = (e) => {
    // e: {value: "CAT_IMG_TYPE", label: "Immagini"}
    console.log(e)
    let opts = []
    for (let i in newDocInfo.tassonomiadocumenti) {
        if(newDocInfo.tassonomiadocumenti[i].categoriadocumenti_id === e.value)
            opts.push(newDocInfo.tassonomiadocumenti[i])
    }
    setTassonomiaOptions(opts)
    props.setValue('tassonomiadocumenti',null)
  }

  //console.log("newDocInfo.tassonomiadocumenti",newDocInfo.tassonomiadocumenti);

  return (
    <React.Fragment>
      <Grid item xs={12}>
        {/* author */}
        <MostTextField
          register={props.register}
          name="author"
          label={props.t("documento:author")}
          id="author"
        />
      </Grid>
      <Grid item xs={12}>
        {/* title */}
        <MostTextField
          required={true}
          register={props.register({ required: true })}
          name="title"
          label={props.t("documento:title")}
          id="title"
        />
        {props.errors.title && <span className="badValue">{props.t("campo obbligatorio")}</span>}
      </Grid>
      {/*
      <Grid item xs={12}>
        <MostTextField
          register={props.register}
          name="versione"
          label={props.t("documento:version")}
          id="versione"
        />
      </Grid>
      */}
      <Grid item xs={12}>
        <Controller
          as={Select}
          name="accessibilitadocumenti"
          options={newDocInfo.accessibilitadocumenti}
          control={props.control}
          placeholder={props.t("documento:accessibilitadocumenti")+" *"}
          rules={{ required: true }}
          className="MuiFormControl-marginDense blackColor"
          defaultValue=""
        />
        {props.errors.accessibilitadocumenti && <span className="badValue">{props.t("campo obbligatorio")}</span>}
      </Grid>
      <Grid item xs={6}>
        <Select
          name="categoriadocumenti"
          onChange={cambioCategoria}
          options={newDocInfo.categoriadocumenti}
          placeholder={props.t("documento:tassonomiadocumenti")+" *"}
          className="MuiFormControl-marginDense blackColor"
          defaultValue=""
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          as={Select}
          name="tassonomiadocumenti"
          options={tassonomiaOptions}
          control={props.control}
          placeholder={props.t("documento:dettaglio")+" *"}
          rules={{ required: true }}
          className="MuiFormControl-marginDense blackColor"
          defaultValue=""
        />
        {props.errors.tassonomiadocumenti && <span className="badValue">{props.t("campo obbligatorio")}</span>}
      </Grid>
    </React.Fragment>
  );
};
