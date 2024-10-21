/** @module MainPages */
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import React, { useContext, useState, useMemo, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Link, Navigate } from "react-router-dom";
import PropagateLoader from "react-spinners/PropagateLoader";

import { useLocation, useParams } from "react-router-dom";
import { canisterId } from "../../declarations/uploads";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Table } from "./Table";
import { appAlert, getAssetPfx } from "./Utils";
import { useAuth } from "./auth/use-auth-client";
import { Check, MostCheckbox, MostSubmitButton, MyCheckIcon, WarningIcon } from "./components/MostComponents";
import { MostDataGrid } from "./components/MostDataGrid";
import { useGlobalState } from "./state";

let dossier_uuid = null;
let want_detail = false;
/**
 * Component for showing dossier rows
 *
 * se nel path c'è un uuid, significa che vogliamo vedere tutti i fogli relativi a quel master_uuid
 *
 * altrimenti visualizzo una riga per ogni opera, con paginazione fatta in locale
 * @function
 */
export const Dossier = () => {
    const asset_pfx = getAssetPfx();

    const react_router_location = useLocation();
    console.log(`Dossier react_router_location: ${JSON.stringify(react_router_location)}`);
    const { backendActor, principal } = useAuth();
    const navigate = useNavigate();
    const { handleSubmit } = useForm();
    const { t } = useTranslation(["dossier", "tipofirma", "tiposupporto", "tipotecnica"]);
    const [loading, setLoading] = useState(true);
    const [dossierPersonali, setDossierPersonali] = useState([]); //elenco dossier
    const [dossierPersonaliMaster, setDossierPersonaliMaster] = useState([]); //elenco dossier
    const [dossierPubblici, setDossierPubblici] = useState([]); //elenco dossier
    const [dossierPubbliciMaster, setDossierPubbliciMaster] = useState([]); //elenco dossier
    const [singleTitle, setSingleTitle] = useState(""); //per la visione singola opera
    const [dossierVisione, setDossierVisione] = useState([]); //elenco dossier
    const [masterOnly, setMasterOnly] = useState(false); //elenco dossier
    const [checkedPubblici, setCheckedPubblici] = React.useState(false);
    const [application, setApplication] = useGlobalState("application");
    const [username, setusername] = useGlobalState("username");
    const [trueidentity, setIdentity] = useGlobalState("identity");

    dossier_uuid = react_router_location.pathname.split("/")[2];
    if (dossier_uuid != null) {
        console.log("dossier_uuid : ", dossier_uuid);
        want_detail = true;
    } else {
        want_detail = false;
    }

    useEffect(() => {
        console.log("useEffect entro: ");

        if (backendActor === null) {
            console.log("Dossier, backendActor null");
            return;
        }
        if (backendActor === "") {
            console.log("Dossier, backendActor empty");
            return;
        }
        if (backendActor === "2vxsx-fae") {
            console.log("Dossier, backendActor 2vxsx-fae");
            return;
        }
        console.log("Dossier, backendActor: ", backendActor);
        const QP = {
            offset: 0,
            limit: 2000,
            // autore: 'Elisabetta Villa'
        };
        backendActor
            .dossier_query(QP)
            .then((Ret_data) => {
                // console.log("dossier returns: ", JSON.stringify(Ret_data));
                if ("Ok" in Ret_data) {
                    const response = JSON.parse(Ret_data.Ok);
                    console.log("dossier_query Ok response: ", response);
                    setDossierPersonali(response.ret_owner);
                    // setDossierPubblici(response.ret_public);
                    if (want_detail) {
                        const singleArtwork = response.ret_public.filter((ele) => ele.master_uuid === dossier_uuid);
                        console.log("dossier_query singleArtwork: ", singleArtwork);
                        const singleTitle = singleArtwork[0].nomeopera;
                        setSingleTitle(singleTitle);
                        console.log("dossier_query singleTitle: ", singleTitle);
                        setDossierPubblici(singleArtwork);
                    } else {
                        const master_only = response.ret_public.filter((ele) => ele.uuid === ele.master_uuid);
                        console.log("dossier_query master_only: ", master_only);
                        setDossierPubblici(master_only);
                    }

                    setLoading(false);
                } else {
                    const err = Ret_data.Err;
                    console.log("dossier_query Err response: ", err);
                    let inner_err = err.CanisterError.message;
                    if (inner_err.includes("not allowed")) {
                        appAlert(err.CanisterError.message);
                        navigate("/home");
                    }
                    setLoading(false);
                    navigate("/selfdefineuser");
                }
            })
            .catch((error) => {
                console.error(error);
                alert(error.message ? error.message : JSON.stringify(error));
            });
    }, [backendActor, navigate]);

    const handleChangePubblici = () => {
        setCheckedPubblici((prev) => !prev);
    };

    const columns = [
        {
            field: "image_uri",
            headerName: t("Opera Image"),
            width: 100,
            height: 100,
            renderCell: (params) => {
                return (
                    <Link
                        to={{
                            pathname: want_detail ? `/dossierdetail/${params.row.id}` : `/dossier/${params.row.master_uuid}`,
                        }}
                        state = {{ dossier_id: `${params.row.id}` , master_uuid: `${params.row.master_uuid}`}}
                        className="nodecoration allCellLink">
                        <div key={`${asset_pfx}${params.row.icon_uri}`} className={"App-image"}>
                            <img src={`${asset_pfx}${params.row.icon_uri}`} width={"100%"} loading={"lazy"} />
                        </div>
                    </Link>
                );
            },
        },
        { flex: 1, headerName: t("dossier:NomeOpera"), field: "nomeopera" },
    ];

    if (application === "elivilla") {
        columns.push({ flex: 1, field: "tiratura", headerName: t("dossier:Tiratura") });
        columns.push({ flex: 1, field: "nft_copies", headerName: t("dossier:NumeroCopie") });
        columns.push({ flex: 1, headerName: t("dossier:celebrity"), field: "celebrity" });
        columns.push({ flex: 1, headerName: t("dossier:year"), field: "year" });
    }

    columns.push({
        flex: 1,
        headerName: t("tipofirma:Label"),
        field: "tipofirma",
        renderCell: (params) => {
            return t(`tipofirma:tipofirma_array.${params.row.tipofirma}`);
        },
    });
    columns.push({
        flex: 1,
        headerName: t("tipotecnica:Label"),
        field: "tipotecnica",
        renderCell: (params) => {
            return t(`tipotecnica:tipotecnica_array.${params.row.tipotecnica}`);
        },
    });
    columns.push({
        flex: 1,
        headerName: t("tiposupporto:Label"),
        field: "tiposupporto",
        renderCell: (params) => {
            return t(`tiposupporto:tiposupporto_array.${params.row.tiposupporto}`);
        },
    });
    columns.push({ flex: 1, headerName: t("dossier:NumeroTotaleCopie"), field: "numero_totale_copie" });
    columns.push({ flex: 1, headerName: t("dossier:SheetIdentifier"), field: "sheet_identifier" });
    columns.push({ flex: 1, headerName: t("dossier:Dimensions"), field: "dimensions" });
    columns.push({ flex: 1, headerName: t("dossier:AnnoOpera"), field: "annoopera" });
    columns.push({ flex: 1, headerName: t("dossier:Owner"), field: "friendly_name" });

    columns.push({
        flex: 1,
        headerName: t("dossier:InBC"),
        field: "contract_initialized",
        renderCell: (params) => {
            return <MyCheckIcon value={params.row.has_artwork_mark} />;
        },
    });

    const masterChange = (e, el) => {
        console.error(`masterChange ${el}`);
        setMasterOnly(el);
    };

    const onSubmit = () => {
        navigate("/newdossier");
    };

    // anche ospiti possono avere token
    return (
        <div>
            <Header />
            <h1>{t("dossier:ArchivioGramberg")}</h1>
            {want_detail ? (
                <h1>
                    {t("dossier:SingleArtworkList")}: {singleTitle}
                </h1>
            ) : (
                <h1>{t("dossier:CompleteArtworkList")}</h1>
            )}

            <MostDataGrid columns={columns} rows={dossierPubblici} />

            {want_detail ? (
                <Container component="main" maxWidth="md">
                    <h2>{t("dossier:GoToArtworkList")} </h2>
                    <div className="MuiContainer-root MuiContainer-maxWidthXs">
                        <MostSubmitButton type="button" onClick={() => navigate("/dossier")} label={t("dossier:Go")} />
                    </div>
                </Container>
            ) : (
                <></>
            )}

            <Footer />
        </div>
    );
};
