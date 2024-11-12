import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import React, { useContext, useState, useMemo, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";

import { backend } from "../../declarations/backend";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { UploadNew } from "./UploadNew";
import { appAlert } from "./Utils";
import { useAuth } from "./auth/use-auth-client";
import { MostCheckbox, MostSelect, MostSubmitButton, MostTextField, MyAutocomplete, MyCheckbox, MyTextField } from "./components/MostComponents";
import { XlsFile } from "./components/XlsFile";
import { DTFooter, DTGrow } from "./components/useStyles";
import { DTRoot } from "./components/useStyles";

/*
 * Inserimento nella tavola cartridge
 *
 * Obbligatorio fornire XLS, da cui viene ricavata il genoma in json
 */
export const CartridgeInsert = () => {
    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [pdfAsset, setPdfAsset] = useState("");
    const [asset, setAsset] = useState({ key: "" });
    const [assets, setAssets] = useState({});
    const [disabledButs, setDisabledButs] = useState(true);
    const [searchele, setSearchele] = useState(false);
    const [note, setNote] = useState("");
    const [dnaText, setDnaText] = useState("");
    const [file, setFile] = useState(null);
    const [jsonData, setJsonData] = useState("");
    const [csvData, setCsvData] = useState("");
    const [csvText, setCsvText] = useState("");
    const [jsonText, setJsonText] = useState("");
    const { backendActor, whoami } = useAuth();

    useEffect(() => {
        if (isLoading) return;
        setIsLoading(true);
        console.log("chiamo backendActor.check_caller: ");
        backendActor
            .check_caller()
            .then((Ret_data) => {
                // console.log("dossier returns: ", JSON.stringify(Ret_data));
                if ("Ok" in Ret_data) {
                    if (!Ret_data.Ok.add_dna_ok) {
                        appAlert(t("add_dna_nak"));
                        navigate("/home");
                    }
                    setIsLoading(false);
                } else {
                    const err = Ret_data.Err;
                    appAlert(err.CanisterError.message);
                    navigate("/dossier");
                }
            })
            .catch((error) => {
                appAlert(error.message ? error.message : JSON.stringify(error));
                navigate("/dossier");
            });
    }, [backendActor, navigate, t]);

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
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            console.log("csv: ", csv);
            setJsonText(JSON.stringify(json, null, 2));
            setCsvText(csv);
        };
        reader.readAsBinaryString(e.target.files[0]);
        setDisabledButs(false);
    };

    const onSubmit = (vals) => {
        vals.uuid = uuidv4();
        vals.dna_text = csvText;
        if (assets[0] === undefined) {
            vals.dna_file_asset = "NO file";
        } else {
            console.log(assets[0]);
            vals.dna_file_asset = assets[0].key;
        }
        vals.lab_name = "Laboratorio CNR Catania";
        vals.note = note;

        vals.insert_time = new Date();
        vals.username = whoami;

        setDisabledButs(true);
        console.log("onSubmit: ", JSON.stringify(vals));
        backendActor
            .cartridge_insert(JSON.stringify(vals))
            .then((Ret_data) => {
                console.log("cartridge_insert returns: ", JSON.stringify(Ret_data));
                if ("Ok" in Ret_data) {
                    const response = JSON.parse(Ret_data.Ok);
                    appAlert(t("InsertedDNA"));
                    setDisabledButs(true);
                    navigate("/home");
                } else {
                    const err = Ret_data.Err;
                    appAlert(err);
                    setDisabledButs(false);
                }
            })
            .catch((error) => {
                console.error(error);
                alert(error.message ? error.message : JSON.stringify(error));
                setDisabledButs(false);
            });
    };

    return (
        <>
            <Header />
            <div className={DTRoot}>
                <Container component="main" maxWidth="lg">
                    <Grid container spacing={2} direction="column" alignItems="center">
                        <Grid item xs={12}>
                            <Typography variant="h3">{t("CartridgeInsert")}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <XlsFile setDisabledButs={setDisabledButs} setCsvText={setCsvText} setJsonText={setJsonText} />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2} direction="row" alignItems="center">
                                <Grid item xs={"auto"}>
                                    {t("DnaFilePdf")}
                                </Grid>
                                <Grid item xs={"auto"}>
                                    <UploadNew asset={assets[0]} assets={assets} accept={"application/pdf"} setAsset={setAsset} setAssets={setAssets} setDisabledButs={setDisabledButs} show={false} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <MyTextField name="note" label={t("note")} onChange={(e) => setNote(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <MostSubmitButton disabled={disabledButs} label={t("dossier:Inserisci")} />
                            </form>
                        </Grid>
                    </Grid>
                </Container>
            </div>
            <Footer />
        </>
    );
};
