import React, { useState, useMemo, useEffect, useCallback } from "react";
// import { DataGrid } from '@material-ui/data-grid';
import { useNavigate } from "react-router-dom";
import { useGlobalState } from './state';
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
// import MyAxios, { check_response } from "./MyAxios";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Table } from "./Table";
import {
  MostCheckbox,
  MostSubmitButton,
  WarningIcon,
  Check,
} from "./components/MostComponents";
import { MostDataGrid } from "./components/MostDataGrid";
import { Riservato } from "./components/OpusComponents";
import InVisionDialog from "./components/InVisionDialog";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Collapse from "@mui/material/Collapse";
import PropagateLoader from "react-spinners/PropagateLoader";
// import { css } from "@emotion/core";
import { backend } from "../../declarations/backend";
import { uploads } from "../../declarations/uploads";

import {Ed25519KeyIdentity} from '@dfinity/identity';
import {HttpAgent} from '@dfinity/agent';
import {AssetManager} from '@dfinity/assets';

/**
 * Component for showing dossier rows
 *
 * @component
 */
export const Dossier = () => {
// const canisterId = process.env.CANISTER_ID_UPLOADS;
const canisterId = 'br5f7-7uaaa-aaaaa-qaaca-cai';
const asset_pfx = `http://${canisterId}.localhost:4943`;
// console.log("process.env :", JSON.stringify(process.env));
console.log("asset_pfx :", asset_pfx);
// Hardcoded principal: 535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe
// Should be replaced with authentication method e.g. Internet Identity when deployed on IC
const identity = Ed25519KeyIdentity.generate(new Uint8Array(Array.from({length: 32}).fill(0)));
const isLocal = !window.location.host.endsWith('ic0.app');
const agent = new HttpAgent({
    host: isLocal ? `http://127.0.0.1:${window.location.port}` : 'https://ic0.app', identity,
    //host: isLocal ? `http://${canisterId}.localhost:${window.location.port}` : 'https://ic0.app', identity,
});
    if (false) {
if (isLocal) {
    agent.fetchRootKey().catch((err) => {
      console.warn( "Unable to fetch root key. Check to ensure that your local replica is running");
      console.error(err);
    });
}
}


  const navigate = useNavigate();
  const { handleSubmit } = useForm();
  const { t } = useTranslation(["dossier"]);
  const [loading, setLoading] = useState(true);
  const [dossierPersonali, setDossierPersonali] = useState([]); //elenco dossier
  const [dossierPersonaliMaster, setDossierPersonaliMaster] = useState([]); //elenco dossier
  const [dossierPubblici, setDossierPubblici] = useState([]); //elenco dossier
  const [dossierVisione, setDossierVisione] = useState([]); //elenco dossier
  const [masterOnly, setMasterOnly] = useState(false); //elenco dossier
  const [checkedPubblici, setCheckedPubblici] = React.useState(false);
  const [application, setApplication] = useGlobalState('application');
  const [username, setusername] = useGlobalState('username');
  const [trueidentity, setIdentity] = useGlobalState('identity');


  useEffect(() => {
    let QP = {
        offset: 0,
        limit:50,
        // autore: 'Elisabetta Villa'
    };
    // console.log("QP  is " + JSON.stringify(QP));
    backend.dossier_query(QP).then((Ok_data) =>  {
        let data = JSON.parse(Ok_data.Ok);
        console.log("data returns: ",JSON.stringify(data));
        // console.log("raw data returns: ",data);
        setDossierPersonali(data.ret_owner);
        // setDossierPersonaliMaster( data.ret_owner.filter((riga) => riga.master_dossier_id === null),);
        // setDossierPubblici(data.ret_public);
        // setDossierVisione(data.ret_vision);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        alert(error.message ? error.message : JSON.stringify(error));
      });
  }, [t ]);

  const handleChangePubblici = () => {
    setCheckedPubblici((prev) => !prev);
  };

  let columns = [
    { field: 'image_uri', headerName: t('Opera Image'), width: 100, height: 100,  renderCell: (params)=>{
      return (
            <Link
              to={{
                pathname: "/dossierdetail/" + params.row.id,
                state: { dossier_id: params.row.id },
              }}
              target="_blank"
              className="nodecoration allCellLink"
              >
          <div key={`${asset_pfx}${params.row.icon_uri}`} className={'App-image'} >
            <img src={`${asset_pfx}${params.row.icon_uri}`} width= {'100%'}  loading={'lazy'}/>
          </div>
            </Link>
      )
    } },
    { flex:1, headerName: t("dossier:Autore"), field: "autore"}, 
    { flex:1, headerName: t("dossier:NomeOpera"), field: "nomeopera"},
    { flex:1, headerName: t("dossier:TipoOpera"), field: "tipoopera"},
    { flex:1, headerName: t("dossier:LuogoOpera"), field: "luogoopera"},
  ]

  if (application == "elivilla") {
    columns.push({ flex:1, field: "tiratura", headerName: t("dossier:Tiratura")}),
    columns.push({ flex:1, field: "nft_copies", headerName: t("dossier:NumeroCopie")}),
    columns.push({ flex:1, headerName: t("dossier:celebrity"), field: "celebrity", });
    columns.push({ flex:1, headerName: t("dossier:year"), field: "year" });
  }

  columns.push({ flex:1, headerName: t("dossier:NFT id"), field: "token_id" });
  columns.push({ flex:1, headerName: t("dossier:In BC"), field: "contract_initialized" , renderCell: (params)=>{
      if (params.row.contract_initialized) {
        if (params.row.docs_bcsync) return <Check good={true} />;
        return <WarningIcon />;
      }
      return <Check good={false} />;
    }
  });


  const masterChange = (e, el) => {
    console.error("masterChange " + el);
    setMasterOnly(el);
  };

  const onSubmit = () => {
    navigate("/newdossier");
  };

  // anche ospiti possono avere token
  return (
    <div>
      <Header />
      {application == "techne" ? (
        <h1>{t("dossier:DossierHeader")}</h1>
      ) : (
        <>
          <h1>{t("dossier:PictureHeader")}</h1>
          <MostCheckbox
            name="masterOnly"
            defaultChecked={false}
            onChange={masterChange}
            label={t("dossier:MasterOnly")}
          />
        </>
      )}

      <h2>{t("dossier:DossierPersonali")}</h2>
      <div className="blackColor margin20 gray">
        {loading ? null : (
          <React.Fragment>
            {dossierPersonali.length ? (
              masterOnly ? (
                <MostDataGrid columns={columns} rows={dossierPersonaliMaster} />
              ) : (
                <MostDataGrid columns={columns} rows={dossierPersonali} />
              )
            ) : (
              t("dossier:NoDossier")
            )}
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="MuiContainer-root MuiContainer-maxWidthXs">
                  {application == "techne" ? (
                    <MostSubmitButton label={t("dossier:NuovoDossier")} />
                  ) : (
                    <MostSubmitButton label={t("dossier:NuovaFoto")} />
                  )}
                </div>
              </form>
            </div>
          </React.Fragment>
        )}
      </div>

      {application == "techne" ? (
        loading ? (
          <PropagateLoader color="#AAAA00" loading={loading} />
        ) : (
          <React.Fragment>
            <h2>{t("dossier:DossierVisione")}</h2>
            <div className="blackColor">
              {dossierVisione.length ? (
                <React.Fragment>
                  <div className="margin20 gray">
                    <Table columns={columns[1]} data={dossierVisione} />
                  </div>
                </React.Fragment>
              ) : (
                t("dossier:NoDossier")
              )}
            </div>

            <h2>{t("dossier:DossierPubblici")}</h2>
            <div className="blackColor">
              {dossierPubblici.length ? (
                <React.Fragment>
                  <FormControlLabel
                    control={
                      <Routes
                        color="primary"
                        checked={checkedPubblici}
                        onChange={handleChangePubblici}
                      />
                    }
                    label={
                      t("dossier:Mostra") +
                      " (" +
                      dossierPubblici.length +
                      " " +
                      t("dossier") +
                      ")"
                    }
                  />
                  <div className="margin20 gray">
                    <Collapse in={checkedPubblici}>
                      <Table columns={columns[1]} data={dossierPubblici} />
                    </Collapse>
                  </div>
                </React.Fragment>
              ) : (
                t("dossier:NoDossier")
              )}
            </div>
          </React.Fragment>
        )
      ) : null}

      <Footer />
    </div>
  );
};
