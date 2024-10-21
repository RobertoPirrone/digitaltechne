import Autocomplete from "@mui/material/Autocomplete";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { XlsFile } from "./components/XlsFile";

import { MostCheckbox, MostSelect, MostSubmitButton, MostTextField, MyAutocomplete, MyCheckbox, MyTextField } from "./components/MostComponents";
import { SpecializedSelect } from "./components/SpecializedSelect";

import { backend } from "../../declarations/backend";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Upload } from "./Upload";
import { UploadNew } from "./UploadNew";
import { appAlert } from "./Utils";
import { useAuth } from "./auth/use-auth-client";
import { DTRoot } from "./components/useStyles";
import { useGlobalState } from "./state";

export const NewDossier = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useGlobalState("username");
    const [application, setapplication] = useGlobalState("application");
    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const [disabledButs, setDisabledButs] = useState(true);
    const [newDossierInfo, setNewDossierInfo] = useState({}); //pull down & C.
    const [searchele, setSearchele] = useState(false);
    const [lastInsert, setLastInsert] = useState(null);
    const { t } = useTranslation(["translation", "dossier", "tipotecnica", "tiposupporto", "tipofirma"]);
    const [uploadInfo, setUploadInfo] = useState(null);
    const [uploadInfoSignatures, setUploadInfoSignatures] = useState(null);
    const [action, setAction] = useState("");
    const [asset, setAsset] = useState({});
    const [assets, setAssets] = useState([{}]);
    const [privateDossier, setPrivateDossier] = useState(false);
    const [nomeOpera, setNomeOpera] = useState("");
    const [tipoOpera, setTipoOpera] = useState("");
    const [luogoOpera, setLuogoOpera] = useState("");
    const [autore, setAutore] = useState("");
    const [tipotecnica, setTipotecnica] = useState("");
    const [annoopera, setAnnoopera] = useState(1900);
    const [numero_totale_copie, setNumero_totale_copie] = useState(0);
    const [dimensions, setDimensions] = useState("");
    const [tiposupporto, setTiposupporto] = useState("");
    const { backendActor, principal } = useAuth();
    const [copieFirmate, setCopieFirmate] = useState(0);
    const [copieNonFirmate, setCopieNonFirmate] = useState(0);
    const [copiePdA, setCopiePdA] = useState(0);

    useEffect(() => {
        setSearchele(false);
    }, []);

    const actionChange = (e, el) => {
        console.error(JSON.stringify(el));
        setAction(el.value);
    };

    const onInsert = (what, id) => {
        setLastInsert({ what: what, id: id });
    };

    const onSubmit = (vals) => {
        if (asset === {}) {
            appAlert("File immagine non scelto");
            return;
        }
        const tech = "";
        let seq = "";
        let master_uuid = "";
        let tipofirma = "";
        let max_cnt = 0;

        vals.uuid = uuidv4();
        master_uuid = vals.uuid;
        vals.ora_inserimento = new Date();
        vals.username = username;
        vals.autore = "Liliana Gramberg";
        vals.annoopera = Number.parseInt(annoopera);
        vals.nomeopera = nomeOpera;
        vals.tipotecnica = tipotecnica;
        vals.dimensions = dimensions;
        vals.numero_totale_copie = Number.parseInt(numero_totale_copie);
        vals.tiposupporto = tiposupporto;
        if (privateDossier === null || privateDossier === false) {
            vals.private = false;
        } else {
            vals.private = true;
        }
        vals.icon_uri = assets[0].key;
        setDisabledButs(true);
        console.log("onSubmit: ", JSON.stringify(vals));
        for (tipofirma of ["SIGNED", "NOT_SIGNED", "ARTIST_PROOF"]) {
            if (tipofirma === "SIGNED") {
                max_cnt = copieFirmate;
            } else if (tipofirma === "SIGNED") {
                max_cnt = copieNonFirmate;
            } else {
                max_cnt = copiePdA;
            }
            for (seq = 1; seq <= max_cnt; seq++) {
                if (seq !== 1) vals.uuid = uuidv4();
                vals.master_uuid = master_uuid;
                vals.tipofirma = tipofirma;
                vals.sheet_identifier = `${tipofirma} ${seq.toString()} / ${max_cnt}`;
                console.log("onSubmit dossier_insert: ", vals);
                backendActor
                    .dossier_insert(JSON.stringify(vals))
                    .then((Ret_data) => {
                        if ("Ok" in Ret_data) {
                            console.log("dossier_insert no json returns: ", Ret_data);
                            const response = JSON.parse(Ret_data.Ok);
                            console.log(response);
                            if (response) {
                                setDisabledButs(true);
                                navigate("/dossier");
                            } else {
                                appAlert(response.error);
                                setDisabledButs(false);
                            }
                        } else {
                            const err = Ret_data.Err;
                            console.log("dossier_query Err response: ", err);
                            const inner_err = err.CanisterError.message;
                            if (inner_err.includes("not allowed")) {
                                appAlert(err.CanisterError.message);
                                navigate("/dossier");
                            } else navigate("/selfdefineuser");
                        }
                    })
                    .catch((error) => {
                        console.error("CATCH");
                        console.error(error);
                        alert(error.message ? error.message : JSON.stringify(error));
                        setDisabledButs(false);
                    });
            }
        }
    };

    console.log("newDossierInfo: ", JSON.stringify(newDossierInfo));
    console.log("newDossierInfo: ", JSON.stringify(newDossierInfo.autori));
    console.log("princiapl: ", principal.toText());
    return (
        <div>
            <Header />
            {application === "elivilla" ? (
                <h1>{t("dossier:NewCelebrity")}</h1>
            ) : application === "techne" ? (
                <h1>{t("dossier:NewArtwork")}</h1>
            ) : application === "hypnos" ? (
                <h1>{t("dossier:NewPainting")}</h1>
            ) : application === "cottolengo" ? (
                <h1>{t("dossier:NewDrawing")}</h1>
            ) : (
                <h1>{t("dossier:NewDossier")}</h1>
            )}
            <Container component="main" maxWidth="md">
                <div className={DTRoot}>
                    <UploadNew assets={assets} show={true} asset={assets[0]} setAssets={setAssets} setDisabledButs={setDisabledButs} label={t("dossier:LoadJpgs")} />

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item xs={12}>
                                {" "}
                                <MyTextField name="nomeopera" required={true} label={t("dossier:nomeopera")} onChange={(e) => setNomeOpera(e.target.value)} />{" "}
                            </Grid>
                            <Grid item xs={12}>
                                {" "}
                                <SpecializedSelect defaultValue={""} name="tipotecnica" label={t("tipotecnica:Label")} what={"tipotecnica"} onChange={(e, v) => setTipotecnica(e.target.value)} />{" "}
                            </Grid>
                            <Grid item xs={12}>
                                {" "}
                                <MyTextField name="annoopera" required={true} label={t("dossier:AnnoOpera")} onChange={(e) => setAnnoopera(e.target.value)} />{" "}
                            </Grid>
                            <Grid item xs={12}>
                                {" "}
                                <MyTextField name="numero_totale_copie" required={true} label={t("dossier:NumeroTotaleCopie")} onChange={(e) => setNumero_totale_copie(e.target.value)} />{" "}
                            </Grid>
                            <Grid item xs={12}>
                                {" "}
                                <MyTextField name="copie_firmate" required={true} label={t("dossier:CopieFirmate")} onChange={(e) => setCopieFirmate(e.target.value)} />{" "}
                            </Grid>
                            <Grid item xs={12}>
                                {" "}
                                <MyTextField name="copie_non_firmate" required={true} label={t("dossier:CopieNonFirmate")} onChange={(e) => setCopieNonFirmate(e.target.value)} />{" "}
                            </Grid>
                            <Grid item xs={12}>
                                {" "}
                                <MyTextField name="copie_PdA" required={true} label={t("dossier:CopiePdA")} onChange={(e) => setCopiePdA(e.target.value)} />{" "}
                            </Grid>
                            <Grid item xs={12}>
                                {" "}
                                <MyTextField name="dimensions" required={true} label={t("dossier:dimensions")} onChange={(e) => setDimensions(e.target.value)} />{" "}
                            </Grid>
                            <Grid item xs={12}>
                                {" "}
                                <SpecializedSelect defaultValue={""} name="tiposupporto" label={t("tiposupporto:Label")} what={"tiposupporto"} onChange={(e, v) => setTiposupporto(e.target.value)} />{" "}
                            </Grid>

                            <Grid item xs={3}>
                                {" "}
                                <Typography>Private</Typography> <MyCheckbox defaultChecked={false} onChange={(e, v) => setPrivateDossier(v.label)} />{" "}
                            </Grid>
                            <Grid item xs={12}>
                                {" "}
                                &nbsp;{" "}
                            </Grid>
                            <MostSubmitButton disabled={disabledButs} label={t("dossier:Inserisci")} />
                        </Grid>
                    </form>
                </div>
            </Container>
            <Footer />
        </div>
    );
};

export const BatchInsert = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useGlobalState("username");
    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const { t } = useTranslation(["translation", "dossier", "tipotecnica", "tiposupporto", "tipofirma"]);
    const [disabledButs, setDisabledButs] = useState(true);
    const [csvText, setCsvText] = useState("");
    const [jsonText, setJsonText] = useState("");
    const [files, setFiles] = useState([]);
    const [assets, setAssets] = useState({});
    const { backendActor, principal } = useAuth();

    const onBatchSubmit = (vals) => {
        let file_found = false;
        let fname = "";
        let filename = "";
        let photo = "";
        vals.uuid = uuidv4();
        vals.insert_time = new Date();
        vals.username = "pippo";

        setDisabledButs(true);
        console.log("onBatchSubmit vals: ", vals);
        console.log("onBatchSubmit json: ", jsonText);
        let r = {};
        let ass = {};
        let tech = "";
        let seq = "";
        let master_uuid = "";
        let tipofirma = "";
        let max_cnt = 0;
        let switch_row = false;

        for (r of jsonText) {
            console.log("jsonText element: ", r);

            photo = r.Photos;
            if (photo == null || photo === "") {
                appAlert(`Missing Photo in XLS row: ${JSON.stringify(r)}`);
                continue;
            }
            fname = photo.toString().split("/")[0];
            filename = `DSC_0${fname}.JPG`;
            file_found = false;
            for (ass of assets) {
                // console.log("ASS: ", ass);
                if (ass.original_filename === filename) {
                    // console.log("FOUND FILENAME: ", filename);
                    vals.icon_uri = ass.key;
                    file_found = true;
                    console.log("FOUND FILENAME: ", filename, ", key: ", vals.icon_uri);
                    break;
                }
            }
            // console.log("EXIT INNERLOOP");
            if (!file_found) {
                appAlert(`file not found: ${filename}`);
                continue;
            }

            // console.log("file found, riempimento valori: ", filename);
            vals.uuid = uuidv4();
            master_uuid = vals.uuid;
            vals.ora_inserimento = new Date();
            vals.username = username;
            vals.autore = "Liliana Gramberg";
            vals.annoopera = r.Date != null ? Number.parseInt(r.Date) : 1970;
            vals.nomeopera = r.Title;
            if (r.Technique == null || r.Technique === "") {
                alert("Missing Technique: ", JSON.stringify(r));
                continue;
            }
            tech = r.Technique.toUpperCase();
            switch (tech) {
                case "ACQUAFORTE":
                    tech = "ETCHING";
                    break;
                case "LITOGRAFIA":
                    tech = "LITOGRAPHY";
                    break;
                case "TECNICA MISTA":
                    tech = "MIXED";
                    break;
                case "XILOGRAFIA":
                    tech = "WOODCUT";
                    break;
            }
            vals.tipotecnica = tech;
            vals.tipofirma = "SIGNED";
            vals.dimensions = r.Dimensions === null ? "UNK" : r.Dimensions;
            vals.numero_totale_copie = r.EditionNumber != null ? Number.parseInt(r.EditionNumber) : 1;
            vals.tiposupporto = "PAPER";
            vals.private = false;

            setDisabledButs(true);
            // console.log("onBatchSubmit dossier_insert: ");
            // console.log("onBatchSubmit dossier_insert: ", vals);

            switch_row = true;
            for (tipofirma of ["SIGNED", "NOT_SIGNED", "ARTIST_PROOF"]) {
                max_cnt = r[tipofirma];
                for (seq = 1; seq <= max_cnt; seq++) {
                    if (switch_row) {
                        switch_row = false;
                    } else {
                        vals.uuid = uuidv4(); //ho resettato  uuid a ogni cambio di tipofirma
                    }
                    vals.master_uuid = master_uuid;
                    vals.tipofirma = tipofirma;
                    vals.sheet_identifier = `${tipofirma} ${seq.toString()} / ${max_cnt}`;
                    console.log("onBatchSubmit dossier_insert: ", vals);
                    backendActor
                        .dossier_insert(JSON.stringify(vals))
                        .then((Ok_data) => {
                            console.error("OKKKK");
                            console.log(Ok_data);
                            console.log("dossier_insert no json returns: ", Ok_data);
                            console.log("dossier_insert returns: ", JSON.stringify(Ok_data));
                            const response = JSON.parse(Ok_data.Ok);
                            console.log(response);
                            if (response) {
                                setDisabledButs(true);
                                navigate("/dossier");
                            } else {
                                console.error(response);
                                alert(response.error);
                                setDisabledButs(false);
                            }
                        })
                        .catch((error) => {
                            console.error("CATCH");
                            console.error(error);
                            alert(error.message ? error.message : JSON.stringify(error));
                            setDisabledButs(false);
                        });
                }
            }
        }
        setDisabledButs(false);
    };

    return (
        <>
            <Header />
            <h1>{t("BatchInsert")}</h1>
            <Container component="main" maxWidth="md">
                <div className={DTRoot}>
                    <Grid container spacing={1} alignItems="center">
                        <XlsFile sheetIndex={0} setJsonText={setJsonText} label={"Metadata file (.xlsx format)"} />
                        <UploadNew assets={assets} show={false} setAssets={setAssets} setDisabledButs={setDisabledButs} label={t("dossier:LoadJpgs")} />
                        <Grid item xs={12}>
                            {" "}
                            &nbsp;{" "}
                        </Grid>
                    </Grid>

                    <form onSubmit={handleSubmit(onBatchSubmit)}>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item xs={12}>
                                {" "}
                                &nbsp;{" "}
                            </Grid>

                            <MostSubmitButton disabled={disabledButs} label={t("dossier:Inserisci")} />
                        </Grid>
                    </form>
                </div>
            </Container>
            <Footer />
        </>
    );
};
