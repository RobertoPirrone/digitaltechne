import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import React, { useContext, useState, useMemo, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PropagateLoader from "react-spinners/PropagateLoader";
import { v4 as uuidv4 } from "uuid";

import { HttpAgent } from "@dfinity/agent";
import { AssetManager } from "@dfinity/assets";
import { Ed25519KeyIdentity } from "@dfinity/identity";

import Grid from "@mui/material/Grid";
import { backend } from "../../declarations/backend";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MostDataGrid } from "./components/MostDataGrid";
import { UploadNew } from "./UploadNew";
import { Table } from "./Table";
import { useAuth } from "./auth/use-auth-client";
import { DocData } from "./components/DocData";
import { GoTo, GoToHomePage, MostCheckbox, MostSelect, MostSubmitButton, MostTextField, MyAutocomplete, MyCheckbox, MyTextField } from "./components/MostComponents";
import { DTRoot, DTSubmit } from "./components/useStyles";
import { SpecializedSelect } from "./components/SpecializedSelect";
import { appAlert, getAssetPfx } from "./utils";

/**
 * Operazione di marchiatura di un'opera
 *
 */
export const ArtworkMark = (props) => {
    const asset_pfx = getAssetPfx();
    const navigate = useNavigate();
    const react_router_location = useLocation();
    const dossier_id = react_router_location.pathname.split("/")[2];
    const [assets, setAssets] = useState([{}]);

    const autore_list = ["pippo", "pluto"];
    const tipodocumento_list = ["immagine", "titolo_proprietà"];
    const [cartridgeUuids, setCartridgeUuids] = useState([]);
    const { backendActor, principal } = useAuth();
    console.log(`ArtworkMark location: ${JSON.stringify(react_router_location)}`);
    let dossierInfo = {};
    if (react_router_location.state === null) return <GoTo location={"/dossier"} />;
    dossierInfo = react_router_location.state.dossierInfo;
    console.log(`dossierInfo: ${JSON.stringify(dossierInfo)}`);

    const { t } = useTranslation(["translation", "documento", "dossier"]);
    const [loading, setLoading] = useState(false);
    const [disabledButs, setDisabledButs] = useState(true);
    const [uploadInfo, setUploadInfo] = useState(null);
    const [docs, setDocs] = useState([]);
    const { control, register, handleSubmit, errors, setValue } = useForm();
    const [tipoDocumento, setTipoDocumento] = useState("");
    const [autore, setAutore] = useState("");
    const [titolo, setTitolo] = useState("");
    const [uploads, setUploads] = useState([]);
    const [progress, setProgress] = useState(null);
    const [markDullCode, setMarkDullCode] = useState("");
    const mark_position_list = ["top_left", "top_center", "top_right", "center_left", "center_center", "center_right", "bottom_left", "bottom_center", "bottom_right"];
    const [markPosition, setMarkPosition] = useState("");
    const mark_side_list = ["front", "back", "frame"];
    const [markSide, setMarkSide] = useState("");
    // const [markArray, setMarkArray] = useState([{"id": 0, "markDullCode": "", "markPosition": "", "markSide": ""}]);
    const [markArray, setMarkArray] = useState([]);
    const [ note, setNote ] = useState("");


    useEffect(() => {
        backendActor
            .check_caller()
            .then((Ret_data) => {
                if ("Ok" in Ret_data) {
                    if (!Ret_data.Ok.add_dna_ok) {
                        appAlert(t("dna_mark_nak"));
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
        backendActor
            .cartridge_use_available()
            .then((Ok_data) => {
                console.log("useEffect returns: ", JSON.stringify(Ok_data));
                const response = JSON.parse(Ok_data.Ok);
                console.log(response);
                if (response) {
                    const uuids = response.cartridge_uses.map((item) => {
                        return item.uuid;
                    });
                    setCartridgeUuids(uuids);
                } else {
                    console.error(response);
                    appAlert(response.error);
                    setDisabledButs(false);
                }
            })
            .catch((error) => {
                // handle error
                console.error(error);
                appAlert(error.message ? error.message : JSON.stringify(error));
                setDisabledButs(false);
                setLoading(false);
            });
        if (backendActor === null) {
            navigate("/login");
        }
    }, [backendActor, navigate]);

    const onSubmit = (vals) => {
        // if (!asset) { appAlert("File non scelto"); return; }
        // vals.dossier_id = Number(dossier_id);

        addDna();
        if (markArray.length == 0) {
            appAlert(t("missingValues"));
            abort();
        }
        console.log("markArray:");
        console.dir(markArray);

        let asset = {};
        for (asset of assets) {
            console.log("ASSET:");
            console.dir(asset);
            if (!('filename' in asset)) continue;

            vals.uuid = uuidv4();
            vals.dossieropera_id = Number(dossier_id);
            vals.title = titolo;
            vals.autore = autore;
            // vals["tipo_documento"] = tipo_documento;
            vals.tipo_documento = "ARTWORK_MARK_PICTURE";
            vals.image_uri = asset.key;
            vals.filename = asset.original_filename;
            vals.mimetype = asset.mimetype;
            vals.filesize = asset.file_size;
            vals.versione = 1;
            vals.ora_inserimento = new Date();
            vals.master_uuid = dossierInfo.master_uuid;

            console.log(`onSubmitDocument: ${JSON.stringify(vals)}`);
            setDisabledButs(true);
            setLoading(true);

            backendActor
                .document_insert(JSON.stringify(vals))
                .then((Ok_data) => {
                    console.log("document_insert returns: ", JSON.stringify(Ok_data));
                    const response = Ok_data.Ok;
                })
                .catch((error) => {
                    // handle error
                    console.error(error);
                    appAlert(error.message ? error.message : JSON.stringify(error));
                    setDisabledButs(false);
                    setLoading(false);
                });
        }

        vals.dossier_id = dossier_id;
        vals.username = "xxx";
        vals.ora_inserimento = new Date();
        vals.mark_dull_code = markDullCode;
        vals.mark_position = `${markSide} ${markPosition}`;
        vals.note = note;
        vals.uuid = uuidv4();

        console.log(`onSubmit: ${JSON.stringify(vals)}`);
        setDisabledButs(true);
        setLoading(true);

        backendActor
            .artwork_mark_insert(JSON.stringify(vals))
            .then((Ok_data) => {
                console.log("artwork_mark returns: ", JSON.stringify(Ok_data));
                const response = Ok_data.Ok;
                console.log(response);
                if (response) {
                    setDisabledButs(true);
                    // let url = "/dossierdetail/" + dossier_id;
                    // navigate(url, { state: {dossierInfo: dossierInfo}, replace: true });
                    appAlert(t("InsertedMark"));
                    navigate("/dossier", { replace: true });
                } else {
                    console.error(response);
                    appAlert(response.error);
                    setDisabledButs(false);
                }
            })
            .catch((error) => {
                // handle error
                console.error(error);
                appAlert(error.message ? error.message : JSON.stringify(error));
                setDisabledButs(false);
                setLoading(false);
            });
    };

    console.log("AAAAAAA");
    // manca parametro alla url
    if (!dossier_id) {
        console.log("BBBBBB");
        return <GoToHomePage />;
    }

    const addDna = () => {
        if (markDullCode === "" || (markPosition === "" ) || (markSide === "")) {
            let err_string = t("missingValues");
            appAlert(`${err_string}: markDullCode ${markDullCode}, markPosition ${markPosition}, markSide ${markSide}`);
            return false;
        }
        console.log("addDna");
        console.log(markPosition);
        console.log(markSide);
        console.log("logç");
        console.log(markArray);
        console.log("dir:");
        console.dir(markArray);
        const id = markArray.length +1;
        setMarkArray([...markArray, { "id": id, "markDullCode": markDullCode, "markPosition": markPosition, "markSide": markSide}]);
        setDisabledButs(false);
        // setMarkDullCode("");
        // setMarkSide("");
        // setMarkPosition("");
        console.log("addDna finito");
    };

    let columns = [];
    columns.push({ flex: 1, field: "markDullCode", headerName: t("DNA Code") });
    columns.push({ flex: 1, field: "markSide", headerName: t("Mark Side") });
    columns.push({ flex: 1, field: "markPosition", headerName: t("Mark Position") });

    let marks = [];

    return (
        <div>
            <Header />
            <h1> {t("ArtworkMark")} </h1>
            <Container component="main" maxWidth="md" >
                <img src={`${asset_pfx}${dossierInfo.icon_uri}`} width={200} alt={`${dossierInfo.icon_uri}`} />
                <MostDataGrid columns={columns} rows={markArray} hideFooter={true} />

                <Grid container spacing={1}>
                    <Grid item xs={12}> &nbsp; </Grid>
                    <MyAutocomplete field_name={t("DNA Code")} name="markDullCode" required={true} label={""} options={cartridgeUuids} freeSolo={false} onChange={(e, v) => setMarkDullCode(v)} />
                    <SpecializedSelect field_name={t("Mark Side")} defaultValue={""} name="markSide" label={t("Mark Side")} what={"mark_side"} onChange={(e, v) => setMarkSide(e.target.value)} />
                    <SpecializedSelect field_name={t("Mark Position")} defaultValue={""} name="markPosition" label={t("Mark Position")} what={"mark_position"} onChange={(e, v) => setMarkPosition(e.target.value)} />
                    <MyTextField field_name="Note" name="note" label={t("note")} onChange={(e) => setNote(e.target.value)} />
                    <Grid item xs={12}> &nbsp; </Grid>
                    <Grid item xs={12}>
                        <MostSubmitButton variant="button" onClick={() => addDna()} label={t("AnotherDNA")} />
                    </Grid>
                    <Grid item xs={12}> &nbsp; </Grid>
                    <Grid item xs={12}>
                        <UploadNew assets={assets} show={false} setAssets={setAssets} setDisabledButs={setDisabledButs} label={t("dossier:LoadJpgs")} />
                    </Grid>
                </Grid>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <MostSubmitButton disabled={disabledButs} label={t("dossier:Inserisci")} />
                </form>
            </Container>
            <Footer />
        </div>
    );
};
