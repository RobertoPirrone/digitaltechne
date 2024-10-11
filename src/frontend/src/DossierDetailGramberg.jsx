import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
/** @module MainPages */
import React, { useContext, useState, useMemo, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import { backend } from "../../declarations/backend";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { IconCode } from "./IconCode";
import { Table } from "./Table";
import { appAlert, prettyDate, prettyJson } from "./Utils";
import { useAuth } from "./auth/use-auth-client";
import { Check, GoToHomePage, Loading, MostButton2, MostSelect, MostSubmitButton, MostTextField, MyCheckIcon, WarningIcon } from "./components/MostComponents";
import { MostDataGrid } from "./components/MostDataGrid";
import { useGlobalState } from "./state";

import { HttpAgent } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";

let dossier_id = "";
let dataora = "";

/**
 * Pagina dettaglio singolo foglio. dossier_id come foglia della Url
 *
 * Versione specializzata per Archivio Gramberg (singoli fogli di una tiratura)
 */
export const DossierDetail = () => {
    const { backendActor, whoami } = useAuth();
    const navigate = useNavigate();
    const [showjson, setShowjson] = useState(false);
    const [disabledButs, setDisabledButs] = useState(false);
    const [sellOrInviteMode, setSellOrInviteMode] = useState(null);
    const [controparteUsername, setControparteUsername] = useState(null);
    const [dossierInfo, setDossierInfo] = useState(null);
    const [isVideo, setIsVideo] = useState(null);
    const [docs, setDocs] = useState([]); //elenco documenti relativi a dossier_id
    const [doc_bc_sync, setDoc_bc_sync] = useState(true);
    const [application, setApplication] = useGlobalState("application");

    const { i18n, t } = useTranslation(["translation", "documento", "dossier", "tipofirma", "tipotecnica", "tiposupporto"]);
    const { control, register, handleSubmit, errors } = useForm();
    const [uploads, setUploads] = useState([]);

    const react_router_location = useLocation();
    console.log(`DossierDetail react_router_location: ${JSON.stringify(react_router_location)}`);
    const params = useParams();
    console.log(`DossierDetail params: ${JSON.stringify(params)}`);

    if (params.dossierid) {
        dossier_id = params.dossierid;
        //console.log("DENTRO dossier_id: " + dossier_id);
    } else {
        //console.log("uselocation: " + JSON.stringify(react_router_location));
        dossier_id = react_router_location.pathname.split("/")[2];
    }
    //console.log("dossier_id",dossier_id)

    useEffect(() => {
        if (!dossier_id) return;
        if (backendActor === null) {
            console.log("DossierDetail backendActor null:", JSON.stringify(backendActor));
            // console.log("DossierDetail username null:", JSON.stringify(whoami));
            console.log("DossierDetail backend null:", JSON.stringify(backend));
            return;
            // navigate("/login");
        }

        const jdata = { dossier_id: dossier_id };
        const QP = {
            dossieropera_id: dossier_id,
        };
        console.log(`QP  is ${JSON.stringify(QP)}`);
        if (backend === null) {
            console.log("navigo su /login");
            navigate("/login");
        } else {
            backendActor
                .documenti_query(QP)
                .then((Ok_data) => {
                    console.log("DossierDetail documenti_query returns: ", JSON.stringify(Ok_data));
                    const data = JSON.parse(Ok_data.Ok);
                    const dossierInfo = data.dossier_info;
                    setDossierInfo(dossierInfo);
                    console.error(dossierInfo);
                    setDocs(data.rows);
                })
                .catch((error) => {
                    console.error(error);
                    appAlert(error.message ? error.message : JSON.stringify(error));
                });
        }
    }, [appAlert, backendActor, navigate]);

    const doc_columns = [
        {
            field: "image_uri",
            headerName: t("Opera Image"),
            renderCell: (params) => {
                return <IconCode row={params.row} />;
            },
        },
        { flex: 1, headerName: t("documento:author"), field: "autore" },
        { flex: 1, headerName: t("documento:InsertTime"), field: "ora_inserimento" },
        { flex: 1, headerName: t("documento:tipodocumento"), field: "tipo_documento" },
        { flex: 1, headerName: t("documento:title"), field: "title" },
        { flex: 1, headerName: t("documento:filename"), field: "filename" },
        { flex: 1, headerName: t("documento:mimetype"), field: "mimetype" },
    ];

    const nuovoDoc = () => {
        if (dossierInfo.uuid === dossierInfo.master_uuid) {
            console.log(`DossierDetail nuovoDoc dossier_id: ${dossier_id}`);
            navigate("/newdocument", { replace: true, state: { dossier_id: dossier_id , master_uuid: `${dossierInfo.master_uuid}` } });
        } else {
            appAlert(t("dossier:DocsOnlyOnMaster"));
            navigate(`/dossier/${dossierInfo.master_uuid}`, {state: { dossier_id: `${dossierInfo.id}` , master_uuid: `${dossierInfo.master_uuid}`} });
        }
    };

    const artwork_mark = () => {
        console.log(`artwork_mark dossier_id: ${dossier_id}`);
        const url = `/artwork_mark/${dossier_id}`;
        navigate(url, { state: { dossierInfo: dossierInfo }, replace: true });
    };

    const verify_mark = () => {
        console.log(`verify_mark dossier_id: ${dossier_id}`);
        const url = `/verify_mark/${dossier_id}`;
        navigate(url, { state: { dossierInfo: dossierInfo }, replace: true });
    };

    // manca parametro alla url
    if (!dossier_id) {
        return <GoToHomePage />;
    }

    console.log("dossierInfo: ", dossierInfo);
    console.log("application:", application);
    console.log("whoami:", whoami);
    if (dossierInfo !== null) {
        dataora = prettyDate(dossierInfo.ora_inserimento, i18n.resolvedLanguage);
    }
    return (
        <div>
            <Header />
            {application === "techne" ? <h1>{t("dossier:DossierDetail")}</h1> : <h1>{t("dossier:ImageDetail")}</h1>}
            {dossierInfo ? (
                <div>
                    <Container component="main" maxWidth="md">
                        <table className="ethTable dossierDettaglioTable gray">
                            <tbody>
                                <tr>
                                    {" "}
                                    <th>{t("dossier:Immagine")}</th>{" "}
                                    <td>
                                        {" "}
                                        <IconCode row={dossierInfo} />{" "}
                                    </td>{" "}
                                </tr>
                                <tr>
                                    {" "}
                                    <th>{t("documento:Id")}</th> <td>{dossierInfo.id}</td>{" "}
                                </tr>
                                <tr>
                                    {" "}
                                    <th>{t("documento:Proprietario")}</th> <td>{dossierInfo.friendly_name}</td>{" "}
                                </tr>
                                <tr>
                                    {" "}
                                    <th>{t("documento:Principal")}</th> <td>{dossierInfo.inserted_by}</td>{" "}
                                </tr>
                                <tr>
                                    {" "}
                                    <th>{t("dossier:nomeopera")}</th> <td>{dossierInfo.nomeopera}</td>{" "}
                                </tr>
                                <tr>
                                    {" "}
                                    <th>{t("documento:InsertTime")}</th> <td>{dataora}</td>{" "}
                                </tr>
                                <tr>
                                    {" "}
                                    <th>{t("dossier:autore")}</th> <td>{dossierInfo.autore} </td>
                                </tr>
                                <tr>
                                    {" "}
                                    <th>{t("tiposupporto:Label")}</th> <td> {t(`tiposupporto:tiposupporto_array.${dossierInfo.tiposupporto}`)}</td>{" "}
                                </tr>
                                <tr>
                                    {" "}
                                    <th>{t("tipofirma:Label")}</th> <td> {t(`tipofirma:tipofirma_array.${dossierInfo.tipofirma}`)} </td>{" "}
                                </tr>
                                <tr>
                                    {" "}
                                    <th>{t("tipotecnica:Label")}</th> <td> {t(`tipotecnica:tipotecnica_array.${dossierInfo.tipotecnica}`)} </td>{" "}
                                </tr>
                                <tr>
                                    {" "}
                                    <th>{t("dossier:AnnoOpera")}</th> <td> {dossierInfo.annoopera} </td>{" "}
                                </tr>
                                <tr>
                                    {" "}
                                    <th>{t("dossier:NumeroTotaleCopie")}</th> <td> {dossierInfo.numero_totale_copie} </td>{" "}
                                </tr>
                                <tr>
                                    {" "}
                                    <th>{t("dossier:SheetIdentifier")}</th> <td> {dossierInfo.sheet_identifier} </td>{" "}
                                </tr>
                                <tr>
                                    {" "}
                                    <th>{t("dossier:Dimensions")}</th> <td> {dossierInfo.dimensions} </td>{" "}
                                </tr>
                                <tr>
                                    {" "}
                                    <th>{t("dossier:riservato")}</th> <td>{dossierInfo.private}</td>{" "}
                                </tr>
                                <tr>
                                    <th className="vertalignTop">{t("dossier:InBC")}</th>
                                    <td>
                                        <div>
                                            <MyCheckIcon value={dossierInfo.has_artwork_mark} />
                                            {dossierInfo.has_icon_mark ? (
                                                <>
                                                    <br />
                                                    NFT TokenId: {dossierInfo.token_id}
                                                    <br />
                                                    NFT URI: {dossierInfo.tokenURI}
                                                    <br />
                                                </>
                                            ) : null}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {dossierInfo.inserted_by === whoami ? (
                            !dossierInfo.has_artwork_mark ? (
                                <div className="MuiContainer-root MuiContainer-maxWidthXs">
                                    <MostSubmitButton type="button" disabled={disabledButs} onClick={artwork_mark} label={t("dossier:ApplicaDNA")} />
                                </div>
                            ) : (
                                <div className="MuiContainer-root MuiContainer-maxWidthXs">
                                    <MostSubmitButton type="button" disabled={disabledButs} onClick={verify_mark} label={t("dossier:ComparaDNA")} />
                                </div>
                            )
                        ) : null}
                    </Container>

                    <Container component="main" maxWidth="md">
                        <div className="blackColor">
                            <h2>{t("Documenti")} </h2>
                            <div className="blackColor margin20 gray">{docs.length ? <MostDataGrid columns={doc_columns} rows={docs} /> : t("dossier:NoDocument")}</div>
                            {dossierInfo.inserted_by === whoami ? (
                                <div className="MuiContainer-root MuiContainer-maxWidthXs">
                                    <MostSubmitButton type="button" disabled={disabledButs} onClick={nuovoDoc} label={t("dossier:NuovoDocumento")} />
                                    {dossierInfo.contract_initialized && !doc_bc_sync ? <MostSubmitButton type="button" disabled={disabledButs} onClick={documents2BC} label={t("dossier:Registra i documenti in BlockChain")} /> : null}
                                </div>
                            ) : null}
                        </div>
                    </Container>

                    <Container component="main" maxWidth="md">
                        <h2>{t("dossier:GoToArtworkList")} </h2>
                        <div className="MuiContainer-root MuiContainer-maxWidthXs">
                            <MostSubmitButton type="button" disabled={disabledButs} onClick={() => navigate("/dossier")} label={t("dossier:Go")} />
                        </div>
                    </Container>
                </div>
            ) : (
                <></>
            )}
            <Footer />
        </div>
    );
};
