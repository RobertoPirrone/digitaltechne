import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
// lettura di file XLSX, ritorna json o csv
// TBD: implementarlo come Uplad, quindi con document.createElement("input")
// cfr.: https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";

import { MostCheckbox, MostSelect, MostSubmitButton, MostTextField, MyAutocomplete, MyCheckbox, MyTextField } from "./MostComponents";
import { DTFooter, DTGrow } from "./useStyles";
import { DTRoot } from "./useStyles";

export const XlsFile = ({ setCsvText, setJsonText, setDisabledButs, accept = ".xls,.xlsx", label = "XlsFileXls *", multiple = false, sheetIndex = 1 }) => {
    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [pdfAsset, setPdfAsset] = useState({});
    const [searchele, setSearchele] = useState(false);
    const [note, setNote] = useState("");
    const [file, setFile] = useState(null);

    const gotXls = (e) => {
        console.log("gotXls: ");
        setFile(e.target.files[0]);
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log("gotXls onload: ");
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            console.log("gotXls post read: ");
            const sheetName = workbook.SheetNames[sheetIndex];
            const worksheet = workbook.Sheets[sheetName];
            if (setJsonText) {
                const json = XLSX.utils.sheet_to_json(worksheet);
                console.log("json: ", json);
                setJsonText(json);
            }
            console.log("gotXls post json: ");
            if (setCsvText) {
                const csv = XLSX.utils.sheet_to_csv(worksheet, { FS: "\t", trim: true });
                setCsvText(csv);
                //console.log("csv: ", csv);
            }
            if (setDisabledButs) setDisabledButs(false);
            console.log("gotXls post post: ");
        };
        reader.readAsBinaryString(e.target.files[0]);
    };

    return (
        <>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={6}>
                    {" "}
                    <span className="padding10">{label}</span>
                </Grid>
                <Grid item xs={6}>
                    {" "}
                    <input type="file" accept={accept} multiple={multiple} onChange={gotXls} />{" "}
                </Grid>
            </Grid>
        </>
    );
};
