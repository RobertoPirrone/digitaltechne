import React, { useState, useEffect, useCallback } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from "xlsx";

import { DTGrow, DTFooter } from "./useStyles";
import { MyTextField, MyCheckbox, MyAutocomplete, MostSubmitButton, MostCheckbox, MostSelect, MostTextField } from "./MostComponents";
import { DTRoot } from "./useStyles";

export const DnaFile = (props) => {
    const setDnaText = props.setDnaText;
    const setDisabledButs = props.setDisabledButs;
  const { control, register, handleSubmit, watch, formState: { errors }, } = useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pdfAsset, setPdfAsset] = useState({});
  const [searchele, setSearchele] = useState(false);
  const [note, setNote] = useState("");
    const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState("");


    const gotXls = (e) => {
        console.log("gotXls: ");
        setFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[1];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
          console.log("json: ", json);
        setJsonData(JSON.stringify(json, null, 2));
        setDnaText(JSON.stringify(json, null, 2));
      };
      reader.readAsBinaryString(e.target.files[0]);
        setDisabledButs(false);
    }

  return (
    <>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={6}> <span className="padding10">{t("DnaFileXls")}</span></Grid>
                <Grid item xs={6} > <input type="file" accept=".xls,.xlsx" onChange={gotXls} /> </Grid>
            </Grid>

    </>
  );
}
