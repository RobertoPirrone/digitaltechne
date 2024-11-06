import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from '@mui/material/CircularProgress';
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
import { UploadNew } from "./UploadNew";
import { appAlert } from "./Utils";
import { useAuth } from "./auth/use-auth-client";
import { DTRoot } from "./components/useStyles";
import { useGlobalState } from "./state";
import { GlobalContext } from "./Global";

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
    const [isLoading, setIsLoading] = useState(false);
    const [isUpLoading, setIsUpLoading] = useState(false);
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
    const [annoopera, setAnnoopera] = useState();
    const [numero_totale_copie, setNumero_totale_copie] = useState(0);
    const [dimensions, setDimensions] = useState("");
    const [tiposupporto, setTiposupporto] = useState("");
    const { backendActor, principal } = useAuth();
    const [copieFirmate, setCopieFirmate] = useState(0);
    const [copieNonFirmate, setCopieNonFirmate] = useState(0);
    const [copiePdA, setCopiePdA] = useState(0);
    const globalData = useContext(GlobalContext);

    console.dir(globalData);
    useEffect(() => {
        if (isLoading) return;
        setIsLoading(true);
        backendActor
            .check_caller()
            .then((Ret_data) => {
                // console.log("dossier returns: ", JSON.stringify(Ret_data));
                if ("Ok" in Ret_data) {
                    if (!Ret_data.Ok.add_opera_ok) {
                        appAlert(t("add_opera_nak"));
                        navigate("/dossier");
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

    const onInsert = (what, id) => {
        setLastInsert({ what: what, id: id });
    };

    const onSubmit = (vals) => {
        // console.log("VALS");
        // console.log(vals);

        const tech = "";
        let seq = "";
        let master_uuid = "";
        let tipofirma = "";
        let max_cnt = 0;

        let missing_elements = [];
        let need_ele = null;
        let content = "";
        // TBD per evitare eval, studiare: https://www.geeksforgeeks.org/how-to-use-dynamic-variable-names-in-javascript/
        for (need_ele of ["annoopera", "nomeOpera", "tipotecnica", "tiposupporto", "copieFirmate", "copieNonFirmate", "copiePdA"] ) {

            content = eval(`${need_ele}`)
            // console.log("Need_ele: ", need_ele, content);
            if (content  === "") missing_elements.push(need_ele);
        };
        // console.log("missing_elements.length: ", missing_elements.length);
        if (missing_elements.length != 0) {
            appAlert(`${t("missingValues")}: ${JSON.stringify(missing_elements)}`);
            return false;
        }
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
        vals.signed = Number.parseInt(copieFirmate);
        vals.not_signed = Number.parseInt(copieNonFirmate);
        vals.artist_proof = Number.parseInt(copiePdA);
        vals.tiposupporto = tiposupporto;
        if (privateDossier === null || privateDossier === false) {
            vals.private = false;
        } else {
            vals.private = true;
        }
        vals.icon_uri = assets[0].key;
        setDisabledButs(true);
        setIsUpLoading(true);
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
                console.log(`onSubmit dossier_insert ${tipofirma}, ${seq}: `, vals);
                backendActor
                    .dossier_insert(JSON.stringify(vals))
                    .then((Ret_data) => {
                        setIsUpLoading(false);
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
                            console.log("dossier_insert submit Err response: ", err);
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

    // console.log("newDossierInfo: ", JSON.stringify(newDossierInfo));
    // console.log("newDossierInfo: ", JSON.stringify(newDossierInfo.autori));
    if (isLoading) return;

    return (
        <div>
            <Header />
            <Typography variant="h2">
                {application === "elivilla" ? (
                    t("dossier:NewCelebrity")
                ) : application === "techne" ? (
                    t("dossier:NewArtwork")
                ) : application === "hypnos" ? (
                    t("dossier:NewPainting")
                ) : application === "cottolengo" ? (
                    t("dossier:NewDrawing")
                ) : (
                    t("dossier:NewDossier")
                )}
            </Typography>
            <Container component="main" maxWidth="md">
                <div className={DTRoot}>

                    <UploadNew assets={assets} show={true} asset={assets[0]} setAssets={setAssets} setDisabledButs={setDisabledButs} label={t("dossier:LoadJpgs")} />
                    <form >
                        <Grid container direction="column" spacing={1} >
                            <MyTextField field_name={t("dossier:nomeopera")} name="nomeOpera" required={true} errors={errors} label={t("dossier:nomeopera")} onChange={(e, v) => setNomeOpera(e.target.value)} inputProps={{ maxLength: 30 }} />
                            <SpecializedSelect defaultValue={""} name="tipotecnica" label={t("tipotecnica:Label")} what={"tipotecnica"} onChange={(e, v) => setTipotecnica(e.target.value)} />
                            <MyTextField field_name={t("dossier:AnnoOpera")} name="annoopera" required={true} label={t("dossier:AnnoOpera")} onChange={(e) => setAnnoopera(e.target.value)} />
                            <MyTextField field_name={t("dossier:NumeroTotaleCopie")} name="numero_totale_copie" required={true} label={t("dossier:NumeroTotaleCopie")} onChange={(e) => setNumero_totale_copie(e.target.value)} />
                            <MyTextField field_name={t("dossier:CopieFirmate")} name="copie_firmate" required={true} label={t("dossier:CopieFirmate")} onChange={(e) => setCopieFirmate(e.target.value)} />
                            <MyTextField field_name={t("dossier:CopieNonFirmate")} name="copie_non_firmate" required={true} label={t("dossier:CopieNonFirmate")} onChange={(e) => setCopieNonFirmate(e.target.value)} />
                            <MyTextField field_name={t("dossier:CopiePdA")} name="copie_PdA" required={true} label={t("dossier:CopiePdA")} onChange={(e) => setCopiePdA(e.target.value)} />
                            <MyTextField field_name={t("dossier:dimensions")} name="dimensions" required={true} label={t("dossier:dimensions")} onChange={(e) => setDimensions(e.target.value)} />
                            <SpecializedSelect defaultValue={""} name="tiposupporto" label={t("tiposupporto:Label")} what={"tiposupporto"} onChange={(e, v) => setTiposupporto(e.target.value)} />
                            <Typography display="inline">Private</Typography> <MyCheckbox defaultChecked={false} onChange={(e, v) => setPrivateDossier(v.label)} />
                            <Grid item >
                                &nbsp;
                            </Grid>
                            <MostSubmitButton onClick={handleSubmit(onSubmit)} disabled={disabledButs} label={t("dossier:Inserisci")} />
                        </Grid>
                    </form>
                    {isUpLoading ? <CircularProgress /> : null}
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
    const [isLoading, setIsLoading] = useState(false);
    const [disabledButs, setDisabledButs] = useState(true);
    const [disabledButs1, setDisabledButs1] = useState(true);
    const [disabledButs2, setDisabledButs2] = useState(true);
    const [csvText, setCsvText] = useState("");
    const [jsonText, setJsonText] = useState("");
    const [files, setFiles] = useState([]);
    const [assets, setAssets] = useState({});
    const { backendActor, principal } = useAuth();

    useEffect(() => {
        if (isLoading) return;
        setIsLoading(true);
        backendActor
            .check_caller()
            .then((Ret_data) => {
                // console.log("dossier returns: ", JSON.stringify(Ret_data));
                if ("Ok" in Ret_data) {
                    if (!Ret_data.Ok.add_opera_ok) {
                        appAlert(t("add_opera_nak"));
                        navigate("/home");
                    }
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
    }, [backendActor, navigate, t, isLoading]);

    const onBatchSubmit = (vals) => {
        let file_found = false;
        let fname = "";
        let filename = "";
        let photo = "";
        vals.uuid = uuidv4();
        vals.insert_time = new Date();
        vals.username = "pippo";

        if (disabledButs1 && disabledButs2) return;
        setDisabledButs1(true);
        setDisabledButs2(true);
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

        try {
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
            vals.signed = (r.SIGNED) ? Number.parseInt(r.SIGNED) : 0;
            vals.not_signed = (r.NOT_SIGNED) ? Number.parseInt(r.NOT_SIGNED) : 0;
            vals.artist_proof = (r.ARTIST_PROOF) ? Number.parseInt(r.ARTIST_PROOF) : 0;
            vals.tiposupporto = "PAPER";
            vals.private = false;

            // setDisabledButs(true);
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
                        .then((Ret_data) => {
                            if ("Ok" in Ret_data) {
                                console.log("Batch dossier_insert returns: ", Ret_data);
                                const response = JSON.parse(Ret_data.Ok);
                                console.log(response);
                                if (response) {
                                    navigate("/dossier");
                                } else {
                                    appAlert(Ret_data);
                                    navigate("/home");
                                }
                            } else {
                                const err = Ret_data.Err;
                                console.log("dossier_insert batch submit Err response: ", err);
                                const inner_err = err.CanisterError.message;
                                if (inner_err.includes("not allowed")) {
                                    appAlert(err.CanisterError.message);
                                    navigate("/home");
                                } else navigate("/selfdefineuser");
                            }
                        })
                        .catch((error) => {
                            console.error("CATCH");
                            appAlert(error.message ? error.message : JSON.stringify(error));
                        });
                }
            }
        }
        } catch (e) {
            // console.log(e.message);
            appAlert(`insert Error: ${e.message}`);
        }
    };

    return (
        <>
            <Header />
            <Container component="main" maxWidth="md">
                <div className={DTRoot}>
                    <Grid container direction="column" spacing={1} alignItems="center">
                        <Grid item > <h1>{t("BatchInsert")}</h1> </Grid>
                        <Grid item > <UploadNew assets={assets} show={false} setAssets={setAssets} setDisabledButs={setDisabledButs1} label={t("dossier:LoadJpgs")} /> </Grid>
                        <Grid item > <XlsFile sheetIndex={0} setJsonText={setJsonText} setDisabledButs={setDisabledButs2} label={"Metadata file (.xlsx format)"} /> </Grid>
                        <Grid item > <form onSubmit={handleSubmit(onBatchSubmit)}> 
                            <MostSubmitButton disabled={!(!disabledButs1 && !disabledButs2)} label={t("dossier:Inserisci")} />
                        </form> </Grid>
                    </Grid>
                </div>
            </Container>
            <Footer />
        </>
    );
};
