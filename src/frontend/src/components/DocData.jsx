import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Controller } from "react-hook-form";
import Select from "react-select";
//import TextField from "@material-ui/core/TextField";
// import { useGlobalHook } from '@devhammed/use-global-hook'
import { useForm } from "react-hook-form";

import Grid from "@mui/material/Grid";
import { MostTextField } from "./MostComponents";

/**
 * Form inserimento metadati del documento
 * @component
 */
export const DocData = (props) => {
  const [newDocInfo, setNewDocInfo] = useState({}); //pull down & C.
  const [tassonomiaOptions, setTassonomiaOptions] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { t } = useTranslation(["translation", "documento"]);

  const appAlert = useCallback((text) => {
    alert(text);
  }, []);

  const cambioCategoria = (e) => {
    // e: {value: "CAT_IMG_TYPE", label: "Immagini"}
    console.log(e);
    let opts = [];
    for (let i in newDocInfo.tassonomiadocumenti) {
      if (newDocInfo.tassonomiadocumenti[i].categoriadocumenti_id === e.value) opts.push(newDocInfo.tassonomiadocumenti[i]);
    }
    setTassonomiaOptions(opts);
    props.setValue("tassonomiadocumenti", null);
  };

  //console.log("newDocInfo.tassonomiadocumenti",newDocInfo.tassonomiadocumenti);

  return (
    <React.Fragment>
      <Grid item xs={12}>
        {/* author */}
        <input {...register("author", { required: true })} label={t("documento:author")} />
      </Grid>
      <Grid item xs={12}>
        {/* title */}
        <input {...register("title", { required: true })} label={t("documento:title")} />
      </Grid>
    </React.Fragment>
  );
};
