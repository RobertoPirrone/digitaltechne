import React, { useState, useMemo, useEffect, useCallback } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { MostDataGrid } from "./components/MostDataGrid";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams, useLocation } from "react-router-dom";
import { useGlobalState } from './state';
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Table } from "./Table";
import { Loading, MostSelect, MostTextField, MostButton2, MostSubmitButton, Check, WarningIcon } from "./components/MostComponents";
import { GoToHomePage, Riservato, BexplorerLink } from "./components/OpusComponents";
// import IpfsDialog from "./components/IpfsDialog";
import { dmy_hms, prettyJson } from "./Utils";
//import { provaE } from "./Crypto";
import { backend } from "../../declarations/backend";


import {Ed25519KeyIdentity} from '@dfinity/identity';
import {HttpAgent} from '@dfinity/agent';
import {AssetManager} from '@dfinity/assets';

let dossier_id = "";
const canisterId = import.meta.env.VITE_CANISTER_ID_UPLOADS;
const isLocal = !window.location.host.endsWith('icp0.io');
const asset_pfx = `https://${canisterId}.icp0.io`;
if (isLocal) {
    const asset_pfx = `http://${canisterId}.localhost:4943`;
}

export const DossierDetail = (props) => {
// Hardcoded principal: 535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe
// Should be replaced with authentication method e.g. Internet Identity when deployed on IC
const identity = Ed25519KeyIdentity.generate(new Uint8Array(Array.from({length: 32}).fill(0)));
const fetchOptions = {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };

const agent = new HttpAgent({
    // host: isLocal ? `http://${canisterId}.localhost:${window.location.port}` : 'https://ic0.app', identity,
    host: isLocal ? `http://127.0.0.1:3000` : 'https://ic0.app', identity,
    //fetch: window.fetch.bind(window),
    fetchOptions,
  });

    if (false) {
if (isLocal) {
    agent.fetchRootKey();
}
}

// Canister id can be fetched from URL since frontend in this example is hosted in the same canister as file upload
//const canisterId = new URLSearchParams(window.location.search).get('canisterId') ?? /(.*?)(?:\.raw)?\.ic0.app/.exec(window.location.host)?.[1] ?? /(.*)\.localhost/.exec(window.location.host)?.[1];

// Create asset manager instance for above asset canister
// const assetManager = new AssetManager({canisterId, agent});

  const navigate = useNavigate();
  const [showjson, setShowjson] = useState(false);
  const [disabledButs, setDisabledButs] = useState(false);
  const [sellOrInviteMode, setSellOrInviteMode] = useState(null);
  const [controparteUsername, setControparteUsername] = useState(null);
  const [dossierInfo, setDossierInfo] = useState(null);
  const [isVideo, setIsVideo] = useState(null);
  const [docs, setDocs] = useState([]); //elenco documenti relativi a dossier_id
  const [doc_bc_sync, setDoc_bc_sync] = useState(true);
  const [username, setUsername] = useGlobalState('username');
  const [application, setApplication] = useGlobalState('application');

  const { t } = useTranslation(["translation", "documento", "dossier"]);
  const { control, register, handleSubmit, errors } = useForm();
const [uploads, setUploads] = useState([]);


  const appAlert = useCallback(
    (text) => {
      alert(text);
    },
    [],
  );
  const giorniOptions = [
    { label: "15 giorni", value: 15 },
    { label: "30 giorni", value: 30 },
  ];

  let react_router_location = useLocation();
  console.log("DossierDetail react_router_location: " + JSON.stringify(react_router_location));
  console.log("DossierDetail props: " + JSON.stringify(props));
let params = useParams();
  console.log("DossierDetail params: " + JSON.stringify(params));

  if (params.dossierid) {
    //console.log("Dentro  props: " + JSON.stringify(props.location));
    dossier_id = params.dossierid;
    //console.log("DENTRO dossier_id: " + dossier_id);
  } else {
    //console.log("uselocation: " + JSON.stringify(react_router_location));
    dossier_id = react_router_location.pathname.split("/")[2];
  }
  //console.log("dossier_id",dossier_id)

  useEffect(() => {
    if (!dossier_id) return;
      if (false) {
      assetManager.list()
            .then(assets => assets
                .filter(asset => asset.key.startsWith('/uploads/'))
                .sort((a, b) => Number(b.encodings[0].modified - a.encodings[0].modified))
                .map(({key}) => detailsFromKey(key)))
            .then(setUploads);
      console.log("assets: ", JSON.stringify(uploads));
      }

    let jdata = { dossier_id: dossier_id };
    let QP = {
        dossieropera_id: dossier_id
    };
    console.log("QP  is " + JSON.stringify(QP));
    backend.documenti_query(QP).then((Ok_data) =>  {
        console.log("DossierDetail documenti_query returns: ",JSON.stringify(Ok_data));
        let data = JSON.parse(Ok_data.Ok);
        const dossierInfo = data.dossier_info;
        if (false) {
        setIsVideo(dossierInfo.isVideo);
        // nazionalizzazione: attenzione cambiamo struttura ricevuta via ipc
        if (dossierInfo.bccontract_address) dossierInfo.bccontract_address = dossierInfo.bccontract_address.toLowerCase();
        dossierInfo.tiposupporto_id = t("dossier:tiposupporto_id." + dossierInfo.tiposupporto_id);
        dossierInfo.fruibilitadossier_id = t("dossier:fruibilitadossier_id." + dossierInfo.fruibilitadossierdetail.code);
        if (dossierInfo.luogooperadetail) {
          if (dossierInfo.luogooperadetail.tipoluogo_id) dossierInfo.luogooperadetail.tipoluogo_id = t("dossier:tipoluogo_id." + dossierInfo.luogooperadetail.tipoluogo_id);
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
  }, [appAlert, t]);

  let doc_columns = [
    { field: 'image_uri', headerName: t('Opera Image'), renderCell: (params)=>{
      return (
          <div key={`${asset_pfx}${params.row.image_uri}`} className={'App-image'} >
            <img src={`${asset_pfx}${params.row.image_uri}`} width= {'100%'}  loading={'lazy'}/>
          </div>
      )
    } },
    { flex:1, headerName: t("documento:author"), field: "autore"}, 
    { flex:1, headerName: t("documento:tipodocumento"), field: "tipo_documento"},
    { flex:1, headerName: t("documento:title"), field: "title"},
    { flex:1, headerName: t("documento:filename"), field: "filename"},
    { flex:1, headerName: t("documento:mimetype"), field: "mimetype"},
  ]

  const nuovoDoc = () => {
    console.log("DossierDetail nuovoDoc dossier_id: " + dossier_id);
    navigate( "/newdocument",
        { state: { dossier_id: dossier_id }},
    );
  };

  const documents2BC = () => {
    console.log("documents2BC dossier_id: " + dossier_id);
    let url = "/docsBC/" + dossier_id;
    navigate(url);
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

  //console.log("DOCS",docs)
  //console.log("doc_bc_sync",doc_bc_sync)
  return (
    <div>
      <Header />
      {application == "techne" ? (
        <h1>{t("dossier:DossierDetail")}</h1>
      ) : (
        <h1>{t("dossier:ImageDetail")}</h1>
      )}
      {dossierInfo ? (
        <div>
          <Container component="main" maxWidth="md">
            <table className="ethTable dossierDettaglioTable gray">
              <tbody>
                <tr>
                  <th>{t("dossier:Immagine")}</th>
                  <td>
                    {isVideo ? (
                      <video controls autoPlay width="400" >
                      <source src={`${asset_pfx}${dossierInfo.icon_uri}`} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={`${asset_pfx}${dossierInfo.icon_uri}`} width={400} />
                    )}
                  </td>
                </tr>
                <tr>
                  <th>{t("documento:Id")}</th>
                  <td>{dossierInfo.id}</td>
                </tr>
                <tr>
                  <th>{t("documento:Proprietario")}</th>
                  <td>{dossierInfo.username}</td>
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
                  <td>
                    {dossierInfo.autore}  {" "}
                  </td>
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
                  <th className="vertalignTop">{t("documento:In BC")}</th>
                  <td>
                    {dossierInfo.contract_initialized ? (
                      <div>
                        <Check good={true} />
                        <br />
                        {t("dossier:Indirizzo contratto")}: {dossierInfo.bccontract_address} <BexplorerLink address={dossierInfo.bccontract_address} />
                        <br />
                        {t("dossier:Hash transazione")}: {dossierInfo.bccontract_hash} <BexplorerLink tx_hash={dossierInfo.bccontract_hash} />
                        <br />
                        NFT TokenId: {dossierInfo.token_id}
                        <br />
                        NFT URI: {dossierInfo.tokenURI}
                        <br />
                        {/*
                            <span className="cursorPointer"><Link underline="always" color="secondary" onClick={() => showUri(dossierInfo.token_id,dossierInfo.tokenURI)}>Mostra</Link></span>
                            */}
                        {showjson ? (
                          <div>
                            <div dangerouslySetInnerHTML={{ __html: prettyJson(dossierInfo.tokenURI_content, 1) }} />
                            {dossierInfo.fruibilitadossierdetail.code === "DOSSIER_FRUIBILITY_COMPLETELY_PRIVATE" ? (
                              <span className="cursorPointer">
                                <Link underline="always" color="secondary" onClick={() => navigate("/checkBC/" + dossierInfo.id)}>
                                  Mostra in chiaro
                                </Link>
                              </span>
                            ) : null}
                          </div>
                        ) : (
                          <span className="cursorPointer">
                            <Link underline="always" color="secondary" onClick={() => setShowjson(true)}>
                              {t("dossier:Mostra")}
                            </Link>
                          </span>
                        )}
                        {/*
                            <MostButton2 className="bcenter" onClick={() => provaE()} label="xxx PROVE xxx" />
                            */}
                      </div>
                    ) : dossierInfo.bccontract_address ? (
                      <span>
                        <WarningIcon /> {t("documento:Operazione non completata")}
                      </span>
                    ) : (
                      <Check good={false} />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            {!sellOrInviteMode && dossierInfo.username === username ? (
              !dossierInfo.contract_initialized ? (
                <React.Fragment>
                  <div className="MuiContainer-root MuiContainer-maxWidthXs">
                    <MostSubmitButton type="button" disabled={disabledButs} onClick={() => alert("Work in Progress")} label={t("documento:Registra il Dossier Opera in BlockChain")} />
                  </div>
                </React.Fragment>
              ) : (
                  application == "techne" ? (
                <div className="MuiContainer-root MuiContainer-maxWidthXs">
                  {dossierInfo.fruibilitadossierdetail.code !== "DOSSIER_FRUIBILITY_COMPLETELY_PUBLIC" ? (
                    <div>
                      <MostSubmitButton type="button" disabled={disabledButs} onClick={invite} label={t("documento:Invita un ospite a visualizzare il tuo Dossier Opera")} />
                    </div>
                  ) : null}
                  <MostSubmitButton type="button" disabled={disabledButs} onClick={sell} label={t("documento:Cedi la tua opera ad un acquirente")} />
                </div>
              ): null)
            ) : null}
            {application != "techne" ? (
              <>
                <div className="MuiContainer-root MuiContainer-maxWidthXs">
                  <MostSubmitButton type="button" disabled={disabledButs} onClick={clone_create} label={t("dossier:DoClone")} />
                </div>
              </>
            ) : null}
          </Container>

          {application != "techne" ? (
            null
          ) : (
          !sellOrInviteMode ? (
            <div>
              <h2>{t("Documenti")} </h2>
              <div className="blackColor margin20 gray">{docs.length ? <MostDataGrid columns={doc_columns} rows={docs} /> : t("dossier:NoDocument") }</div>
              {dossierInfo && username === username ? (
                <div>
                  <div className="MuiContainer-root MuiContainer-maxWidthXs">
                    <MostSubmitButton type="button" disabled={disabledButs} onClick={nuovoDoc} label={t("dossier:NuovoDocumento")} />
                    {/* se dossier gia' in BC e se almeno 1 doc non gia' in BC */}
                    {dossierInfo.contract_initialized && !doc_bc_sync ? <MostSubmitButton type="button" disabled={disabledButs} onClick={documents2BC} label={t("dossier:Registra i documenti in BlockChain")} /> : null}
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
                <MostButton2 variab={controparteUsername} variab_value={true} onClick={() => setControparteUsername(true)} label={t("dossier:Si")} className="margin-sg-10" />{" "}
                <MostButton2 variab={controparteUsername} variab_value={false} onClick={() => setControparteUsername(false)} label={t("dossier:No")} className="margin-sg-10" />
                {controparteUsername === true ? (
                  <div>
                    <Container component="main" maxWidth="md">
                      <form onSubmit={handleSubmit(onSubmitSellOrInvite)} noValidate>
                        {sellOrInviteMode === "sell" ? (
                          <Grid item xs={12}>
                            <MostTextField name="acquirente" required={true} label={t("documento:username acquirente")} register={register({ required: true })} />
                            {errors.acquirente && <span className="badValue">{t("campo obbligatorio")}</span>}
                          </Grid>
                        ) : (
                          <React.Fragment>
                            <Grid item xs={12}>
                              <MostTextField name="ospite" required={true} label={t("dossier:username ospite")} register={register({ required: true })} />
                              {errors.ospite && <span className="badValue">{t("campo obbligatorio")}</span>}
                            </Grid>
                            <Grid item xs={12}>
                              <MostSelect control={control} name="giorni" options={giorniOptions} rules={{ required: true }} placeholder={t("dossier:durata della condivisione") + " *"} />
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
          ))}
        </div>
      ) : (
        <></>
      )}
      <Footer />
    </div>
  );
};

