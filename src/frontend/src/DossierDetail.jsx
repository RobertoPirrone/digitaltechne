import React, { useContext, useState, useMemo, useEffect, useCallback } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { MostDataGrid } from "./components/MostDataGrid";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams, useLocation } from "react-router-dom";
import { useGlobalState } from "./state";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { IconCode } from "./IconCode";
import { Table } from "./Table";
import { MyCheckIcon, Loading, MostSelect, MostTextField, MostButton2, MostSubmitButton, Check, WarningIcon } from "./components/MostComponents";
import { GoToHomePage, Riservato, BexplorerLink } from "./components/OpusComponents";
import { myContext } from "./components/MyContext";
import { dmy_hms, prettyJson } from "./Utils";
import { backend } from "../../declarations/backend";
import { getBackendActor } from "./SignIn";
import { useAuth } from "./auth/use-auth-client";

import { Ed25519KeyIdentity } from "@dfinity/identity";
import { HttpAgent } from "@dfinity/agent";

let dossier_id = "";

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
  // const [ whoami, backendActor ] = useContext(myContext);
  // const backendActor = getBackendActor();
  // const whoami = "2vxsx-fae";

  const { t } = useTranslation(["translation", "documento", "dossier"]);
  const { control, register, handleSubmit, errors } = useForm();
  const [uploads, setUploads] = useState([]);

  const appAlert = useCallback((text) => {
    alert(text);
  }, []);
  const giorniOptions = [
    { label: "15 giorni", value: 15 },
    { label: "30 giorni", value: 30 },
  ];

  let react_router_location = useLocation();
  console.log("DossierDetail react_router_location: " + JSON.stringify(react_router_location));
  let params = useParams();
  console.log("DossierDetail params: " + JSON.stringify(params));

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
    if (false) {
      assetManager
        .list()
        .then((assets) =>
          assets
            .filter((asset) => asset.key.startsWith("/uploads/"))
            .sort((a, b) => Number(b.encodings[0].modified - a.encodings[0].modified))
            .map(({ key }) => detailsFromKey(key)),
        )
        .then(setUploads);
      console.log("assets: ", JSON.stringify(uploads));
    }

    let jdata = { dossier_id: dossier_id };
    let QP = {
      dossieropera_id: dossier_id,
    };
    console.log("QP  is " + JSON.stringify(QP));
    if (backend === null) {
      console.log("navigo su /login");
      navigate("/login");
    } else {
      backendActor
        .documenti_query(QP)
        .then((Ok_data) => {
          console.log("DossierDetail documenti_query returns: ", JSON.stringify(Ok_data));
          let data = JSON.parse(Ok_data.Ok);
          const dossierInfo = data.dossier_info;
          if (false) {
            setIsVideo(dossierInfo.isVideo);
            // nazionalizzazione: attenzione cambiamo struttura ricevuta via ipc
            if (dossierInfo.bccontract_address) dossierInfo.bccontract_address = dossierInfo.bccontract_address.toLowerCase();
            dossierInfo.tiposupporto_id = t("dossier:tiposupporto_id." + dossierInfo.tiposupporto_id);
            dossierInfo.fruibilitadossier_id = t("dossier:fruibilitadossier_id." + dossierInfo.fruibilitadossierdetail.code);
            if (dossierInfo.luogooperadetail) {
              if (dossierInfo.luogooperadetail.tipoluogo_id)
                dossierInfo.luogooperadetail.tipoluogo_id = t("dossier:tipoluogo_id." + dossierInfo.luogooperadetail.tipoluogo_id);
              else dossierInfo.luogooperadetail.tipoluogo_id = "";
            }
            if (dossierInfo.statusopera_id) dossierInfo.statusopera_id = t("dossier:statusopera_id." + dossierInfo.statusopera_id);
            if (dossierInfo.fruibilitaopera_id) dossierInfo.fruibilitaopera_id = t("dossier:fruibilitaopera_id." + dossierInfo.fruibilitaopera_id);
          }
          setDossierInfo(dossierInfo);
          console.error(dossierInfo);
          setDocs(data.rows);
        })
        .catch(function (error) {
          console.error(error);
          appAlert(error.message ? error.message : JSON.stringify(error));
        });
    }
  }, [appAlert, t]);

  let doc_columns = [
    {
      field: "image_uri",
      headerName: t("Opera Image"),
      renderCell: (params) => {
        return (
            <IconCode row={params.row} />
        );
      },
    },
    { flex: 1, headerName: t("documento:author"), field: "autore" },
    { flex: 1, headerName: t("documento:tipodocumento"), field: "tipo_documento" },
    { flex: 1, headerName: t("documento:title"), field: "title" },
    { flex: 1, headerName: t("documento:filename"), field: "filename" },
    { flex: 1, headerName: t("documento:mimetype"), field: "mimetype" },
  ];

  const nuovoDoc = () => {
    console.log("DossierDetail nuovoDoc dossier_id: " + dossier_id);
    navigate("/newdocument", { replace: true, state: { dossier_id: dossier_id } });
  };

  const artwork_mark = () => {
    console.log("artwork_mark dossier_id: " + dossier_id);
    let url = "/artwork_mark/" + dossier_id;
    navigate(url, { state: {dossierInfo: dossierInfo}, replace: true});
  };

  const verify_mark = () => {
    console.log("verify_mark dossier_id: " + dossier_id);
    let url = "/verify_mark/" + dossier_id;
    navigate(url, {replace: true});
  };

  const sell = () => {
    setSellOrInviteMode("sell");
  };

  const invite = () => {
    setSellOrInviteMode("invite");
  };

  const onSubmitSellOrInvite = (vals) => {
    console.log("onSubmitSellOrInvite: " + JSON.stringify(vals));
    if (sellOrInviteMode === "sell") doSell(vals);
    else doInvite(vals);
  };

  const doSell = (vals) => {
    vals.mode = "check";
    vals.dossierid = dossier_id;
    console.log("doSell: " + JSON.stringify(vals));
    setDisabledButs(true);
    MyAxios.post("/dossiersell", vals)
      .then((response) => {
        response = check_response(response);
        if (response.success) {
          navigate({
            pathname: "/sellBC/" + dossier_id,
            state: {
              acquirente: vals.acquirente,
              acquirente_pub_key64: response.pub_key64,
              acquirente_bcaddress: response.bcaddress,
              docv: response.docv,
            },
          });
        } else {
          console.error(response);
          appAlert(response.error);
          setDisabledButs(false);
        }
      })
      .catch(function (error) {
        console.error(error);
        appAlert(error.message ? error.message : JSON.stringify(error));
        setDisabledButs(false);
      });
  };

  const clone_create = () => {
    let vals = {};
    vals.dossier_id = dossier_id;
    vals.action = "create_clones";
    MyAxios.post("/clone_create", vals)
      .then((response) => {
        alert("Generazione cloni in corso");
        navigate("/dossier");
      })
      .catch(function (error) {
        console.error(error);
        appAlert(error.message ? error.message : JSON.stringify(error));
        setDisabledButs(false);
      });
  };

  const clone_mint = () => {
    let vals = {};
    vals.dossier_id = dossier_id;
    vals.action = "mint_clones";
    MyAxios.post("/clone_create", vals)
      .then((response) => {
        alert("Generazione cloni in corso");
        navigate("/dossier");
      })
      .catch(function (error) {
        console.error(error);
        appAlert(error.message ? error.message : JSON.stringify(error));
        setDisabledButs(false);
      });
  };

  const doInvite = (vals) => {
    vals.mode = "check";
    vals.giorni = vals.giorni.value;
    vals.dossierid = dossier_id;
    console.log("doInvite: " + JSON.stringify(vals));
    setDisabledButs(true);
    MyAxios.post("/dossierinvite", vals)
      .then((response) => {
        response = check_response(response);
        if (response.success) {
          navigate({
            pathname: "/inviteBC/" + dossier_id,
            state: {
              ospite: vals.ospite,
              giorni: vals.giorni,
              ospite_pub_key64: response.pub_key64,
              ospite_bcaddress: response.bcaddress,
              docv: response.docv,
            },
          });
        } else {
          console.error(response);
          appAlert(response.error);
          setDisabledButs(false);
        }
      })
      .catch(function (error) {
        console.error(error);
        appAlert(error.message ? error.message : JSON.stringify(error));
        setDisabledButs(false);
      });
  };

  /*
  function showUri(token_id,tokenURI) {
    MyAxios.get(tokenURI, {
      "baseURL": "/",
    })
    .then(async (response) => {
        let text = 
            "NFT TokenId: "+token_id+"<br/>"+
            "NFT URI: "+tokenURI+"<br/>"+
            "<br/>"
        const json = response.data
        text += prettyJson(json,1)
        appAlert(text)
    })
    .catch(function (error) {
        console.error(error)
        appAlert(error)
    })
  }
  */

  // manca parametro alla url
  if (!dossier_id) {
    return <GoToHomePage />;
  }

  console.log("dossierInfo: ",dossierInfo)
  console.log("application:",application)
  console.log("whoami:",whoami)
  return (
    <div>
      <Header />
      {application == "techne" ? <h1>{t("dossier:DossierDetail")}</h1> : <h1>{t("dossier:ImageDetail")}</h1>}
      {dossierInfo ? (
        <div>
          <Container component="main" maxWidth="md">
            <table className="ethTable dossierDettaglioTable gray">
              <tbody>
                <tr>
                  <th>{t("dossier:Immagine")}</th>
                  <td>
                    <IconCode row={dossierInfo} />
                  </td>
                </tr>
                <tr>
                  <th>{t("documento:Id")}</th>
                  <td>{dossierInfo.id}</td>
                </tr>
                <tr>
                  <th>{t("documento:Proprietario")}</th>
                  <td>{dossierInfo.friendly_name}</td>
                </tr>
                <tr>
                  <th>{t("dossier:nomeopera")}</th>
                  <td>{dossierInfo.nomeopera}</td>
                </tr>

                {application == "elivilla" ? (
                  <>
                    <tr>
                      <th>{t("dossier:celebrity")}</th>
                      <td>{dossierInfo.celebrity}</td>
                    </tr>
                    <tr>
                      <th>{t("dossier:year")}</th>
                      <td>{dossierInfo.year}</td>
                    </tr>
                  </>
                ) : null}
                {application != "techne" ? (
                  <tr>
                    <th>{t("dossier:mint_info")}</th>
                    <td>{JSON.stringify(dossierInfo.mint_info)}</td>
                  </tr>
                ) : null}
                <tr>
                  <th>{t("dossier:autore")}</th>
                  <td>{dossierInfo.autore} </td>
                </tr>
                <tr>
                  <th>{t("dossier:TipoOpera")}</th>
                  <td>{dossierInfo.tipoopera}</td>
                </tr>
                {application == "techne" ? (
                  <>
                    <tr>
                      <th>{t("dossier:TipoSupporto")}</th>
                      <td>{dossierInfo.tiposupporto_id}</td>
                    </tr>
                    <tr>
                      <th>{t("dossier:LuogoOpera")}</th>
                      <td> {dossierInfo.luogoopera} </td>
                    </tr>
                    <tr>
                      <th>{t("dossier:riservato")}</th>
                      <td>{dossierInfo.private}</td>
                    </tr>
                  </>
                ) : null}
                <tr>
                  <th className="vertalignTop">{t("dossier:InBC")}</th>
                  <td>
                      <div>
                        <MyCheckIcon value={dossierInfo.has_artwork_mark} />
                        { dossierInfo.has_icon_mark ? (
                            <>
                        <br />
                        NFT TokenId: {dossierInfo.token_id}
                        <br />
                        NFT URI: {dossierInfo.tokenURI}
                        <br />
                            </>
                        ) : null }
                        {/*
                            <MostButton2 className="bcenter" onClick={() => provaE()} label="xxx PROVE xxx" />
                            */}
                      </div>
                  </td>
                </tr>
              </tbody>
            </table>
            {!sellOrInviteMode && dossierInfo.inserted_by === whoami ? (
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

          {application != "techne" ? null : !sellOrInviteMode ? (
            <div>
              <h2>{t("Documenti")} </h2>
              <div className="blackColor margin20 gray">{docs.length ? <MostDataGrid columns={doc_columns} rows={docs} /> : t("dossier:NoDocument")}</div>
              {dossierInfo && whoami === whoami ? (
                <div>
                  <div className="MuiContainer-root MuiContainer-maxWidthXs">
                    <MostSubmitButton type="button" disabled={disabledButs} onClick={nuovoDoc} label={t("dossier:NuovoDocumento")} />
                    {/* se dossier gia' in BC e se almeno 1 doc non gia' in BC */}
                    {dossierInfo.contract_initialized && !doc_bc_sync ? (
                      <MostSubmitButton type="button" disabled={disabledButs} onClick={documents2BC} label={t("dossier:Registra i documenti in BlockChain")} />
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div>
              <h2>{sellOrInviteMode === "sell" ? t("documento:Cessione opera") : t("documento:Invito ospite")} </h2>
              <div className="blackColor">
                {sellOrInviteMode === "sell" ? t("documento:Acquirente_gia_registrato?") : t("documento:Ospite_gia_registrato?")}
                <br />
                <MostButton2
                  variab={controparteUsername}
                  variab_value={true}
                  onClick={() => setControparteUsername(true)}
                  label={t("dossier:Si")}
                  className="margin-sg-10"
                />{" "}
                <MostButton2
                  variab={controparteUsername}
                  variab_value={false}
                  onClick={() => setControparteUsername(false)}
                  label={t("dossier:No")}
                  className="margin-sg-10"
                />
                {controparteUsername === true ? (
                  <div>
                    <Container component="main" maxWidth="md">
                      <form onSubmit={handleSubmit(onSubmitSellOrInvite)} noValidate>
                        {sellOrInviteMode === "sell" ? (
                          <Grid item xs={12}>
                            <MostTextField
                              name="acquirente"
                              required={true}
                              label={t("documento:username acquirente")}
                              register={register({ required: true })}
                            />
                            {errors.acquirente && <span className="badValue">{t("campo obbligatorio")}</span>}
                          </Grid>
                        ) : (
                          <React.Fragment>
                            <Grid item xs={12}>
                              <MostTextField name="ospite" required={true} label={t("dossier:username ospite")} register={register({ required: true })} />
                              {errors.ospite && <span className="badValue">{t("campo obbligatorio")}</span>}
                            </Grid>
                            <Grid item xs={12}>
                              <MostSelect
                                control={control}
                                name="giorni"
                                options={giorniOptions}
                                rules={{ required: true }}
                                placeholder={t("dossier:durata della condivisione") + " *"}
                              />
                              {errors.giorni && <span className="badValue">{t("campo obbligatorio")}</span>}
                            </Grid>
                          </React.Fragment>
                        )}
                        <MostSubmitButton disabled={disabledButs} label={t("Conferma")} />
                      </form>
                    </Container>
                  </div>
                ) : controparteUsername === false ? (
                  <div>Invitalo a registrarsi su {process.env.REACT_APP_SERVER} e chiedigli di comunicarti il suo username</div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
      <Footer />
    </div>
  );
};
