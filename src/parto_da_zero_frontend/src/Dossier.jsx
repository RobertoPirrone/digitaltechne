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
import { parto_da_zero_backend } from "../../declarations/parto_da_zero_backend";

import {Ed25519KeyIdentity} from '@dfinity/identity';
import {HttpAgent} from '@dfinity/agent';
import {AssetManager} from '@dfinity/assets';

/**
 * Component for showing dossier rows
 *
 * @component
 */
export const Dossier = () => {
// Hardcoded principal: 535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe
// Should be replaced with authentication method e.g. Internet Identity when deployed on IC
const identity = Ed25519KeyIdentity.generate(new Uint8Array(Array.from({length: 32}).fill(0)));
const isLocal = !window.location.host.endsWith('ic0.app');
const agent = new HttpAgent({
    host: isLocal ? `http://127.0.0.1:${window.location.port}` : 'https://ic0.app', identity,
});
if (isLocal) {
    agent.fetchRootKey();
}

// Canister id can be fetched from URL since frontend in this example is hosted in the same canister as file upload
// const canisterId = new URLSearchParams(window.location.search).get('canisterId') ?? /(.*?)(?:\.raw)?\.ic0.app/.exec(window.location.host)?.[1] ?? /(.*)\.localhost/.exec(window.location.host)?.[1];
const canisterId = process.env.CANISTER_ID_PARTO_DA_ZERO_BACKEND;
// console.log(JSON.stringify(process.env));
// console.log(JSON.stringify(canisterId));


// Create asset manager instance for above asset canister
const assetManager = new AssetManager({canisterId, agent});

  const history = useNavigate();
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


  useEffect(() => {
    let QP = {
        offset: 0,
        limit:50,
        autore: 'Elisabetta Villa'
    };
    console.log("QP  is " + JSON.stringify(QP));
    // backend.dossier_query(QP).then((result) => { console.log("The current result is " + JSON.stringify(result)); });
    //MyAxios.get("dossieropera") .then((response) => {
    parto_da_zero_backend.dossier_query(QP).then((Ok_data) =>  {
        console.log("dossieropera returns: ",JSON.stringify(Ok_data));
        let data = JSON.parse(Ok_data.Ok);
        console.log("data returns: ",JSON.stringify(data));
        console.log("raw data returns: ",data);
        console.log("data success: ",JSON.stringify(data.success));
        console.log("data ret_owner: ",JSON.stringify(data.ret_owner));
        // let data = check_response(response);
        // if (!data.success) { console.error(data.error); appAlert(data.error); return; }
        // for (let dossier_type of ["ret_owner", "ret_public", "ret_vision"]) { data[dossier_type].forEach((r) => { for (let e of ["fruibilitaopera_id", "statusopera_id"]) { if (r[e]) r[e] = t("dossier:" + e + "." + r[e]); else r[e] = null; } }); }
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
          <div key={params.row.icon_uri} className={'App-image'} >
            <img src={params.row.icon_uri} width= {'100%'}  loading={'lazy'}/>
          </div>
            </Link>
      )
    } },
    { flex:1, field: "tiratura", headerName: t("dossier:Tiratura")},
    { flex:1, field: "nft_copies", headerName: t("dossier:NumeroCopie")},
    { flex:1, headerName: t("dossier:Autore"), field: "cognome"}, 
    { flex:1, headerName: t("dossier:NomeOpera"), field: "nomeopera"},
    { flex:1, headerName: t("dossier:TipoOpera"), field: "tipoopera"},
  ]

  if (application == "elivilla") {
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

  const XXXcolumns = useMemo(() => {
    const imageCol = {
      accessor: "tiratura",
      Header: t("dossier:Tiratura"),
    };
    const tiraturaCol = {
      accessor: "tiratura",
      Header: t("dossier:Tiratura"),
    };
    const copiesCol = {
      accessor: "nft_copies",
      Header: t("dossier:NumeroCopie"),
    };
    const proprietarioCol = {
      Header: t("dossier:Proprietario"),
      columns: [
        {
          Header: "",
          accessor: "username",
          Cell: ({ cell: { value }, row: { original } }) => {
            const ui = original.useridentitydetail;
            if (ui)
              return (
                <span>
                  {ui.nome + " " + ui.cognome + " (" + value + ")"}
                  <Riservato reserved={original.riservatezzaproprietario} />
                </span>
              );
            if (!value) return <Riservato reserved={true} />;
            return (
              <span>
                {value}
                <Riservato reserved={original.riservatezzaproprietario} />
              </span>
            );
          },
        },
      ],
    };
    const autoreCol = {
      Header: t("dossier:Autore"),
      columns: [
        {
          Header: t("dossier:Cognome"),
          accessor: "autoredetail.cognome",
        },
        {
          Header: t("dossier:Nome"),
          accessor: "autoredetail.nome",
        },
        {
          Header: t("dossier:Detto"),
          accessor: "autoredetail.nomeinarte",
        },
      ],
    };

    let columns = [];
    // 0 : propri dossier
    // 1 : dossier di altri
    for (let i = 0; i < 2; i++) {
      let icon;
      if (i) icon = <SearchIcon />;
      else icon = <SettingsIcon />;
      const operaColColumns = [
        {
          Header: t("dossier:Dettaglio"),
          accessor: "id",
          Cell: ({ cell: { value }, row: { original } }) => {
            return (
              <Tooltip title={t("Apri dettaglio")}>
                <Link
                  to={{
                    pathname: "/dossierdetail",
                    state: { dossier_id: value },
                  }}
                  className="nodecoration allCellLink"
                >
                  {icon}
                </Link>
              </Tooltip>
            );
          },
        },
        {
          Header: t("dossier:NomeOpera"),
          accessor: "nomeopera",
          Cell: ({ cell: { value }, row: { original } }) => {
            return (
              <Tooltip title={t("Apri dettaglio")}>
                <Link
                  to={{
                    pathname: "/dossierdetail",
                    state: { dossier_id: original.id },
                  }}
                  className="nodecoration allCellLink"
                >
                  {value}
                </Link>
              </Tooltip>
            );
          },
        },
        {
          Header: t("dossier:TipoOpera"),
          accessor: "tipoopera_id",
        },
        /*
          {
            Header: t("dossier:TipoSupporto"),
            accessor: "tiposupporto_id",
          },
          */
        {
          Header: t("dossier:LuogoOpera"),
          accessor: "luogooperadetail.citta",
          Cell: ({ cell: { value }, row: { original } }) => {
            let tipoluogo_id = "";
            if (
              original.luogooperadetail &&
              original.luogooperadetail.tipoluogo_id
            )
              tipoluogo_id = t(
                "dossier:tipoluogo_id." +
                  original.luogooperadetail.tipoluogo_id,
              );
            return (
              <span>
                {original.luogooperadetail
                  ? original.luogooperadetail.citta +
                    " " +
                    original.luogooperadetail.indirizzo +
                    " " +
                    original.luogooperadetail.nazione +
                    " (" +
                    tipoluogo_id +
                    ")"
                  : ""}
                <Riservato reserved={original.riservatezzaluogo} />
              </span>
            );
          },
        },
        {
          Header: t("dossier:StatoOpera"),
          accessor: "statusopera_id",
          Cell: ({ cell: { value }, row: { original } }) => {
            return (
              <span>
                {value}
                <Riservato reserved={original.riservatezzastatus} />
              </span>
            );
          },
        },
        {
          Header: t("dossier:FruibilitaOpera"),
          accessor: "fruibilitaopera_id",
        },
      ];
      if (application == "elivilla") {
        operaColColumns.push({
          Header: t("dossier:celebrity"),
          accessor: "celebrity",
        });
        operaColColumns.push({ Header: t("dossier:year"), accessor: "year" });
      }
      const operaCol = {
        Header: t("Opera"),
        columns: operaColColumns,
      };

      const altroColColumns = [
        {
          Header: t("dossier:NFT id"),
          accessor: "token_id",
        },
        {
          Header: t("dossier:In BC"),
          accessor: "contract_initialized",
          Cell: ({ cell: { value }, row: { original } }) => {
            if (value) {
              if (original.docs_bcsync) return <Check good={true} />;
              return <WarningIcon />;
            }
            return <Check good={false} />;
          },
        },
      ];
      if (i === 0) {
        altroColColumns.push({
          Header: t("dossier:InVisione"),
          accessor: "visible_cnt",
          Cell: ({ cell: { value }, row: { original } }) => {
            if (value) {
              const inVisionRows = original.inVisionRows;
              return <InVisionDialog inVisionRows={inVisionRows} />;
            } else {
              return "";
            }
          },
        });
        altroColColumns.push({
          Header: t("dossier:FruibilitaDossier"),
          accessor: "fruibilitadossier_id",
        });
      }
      const altroCol = {
        Header: t("dossier:Dossier"),
        columns: altroColColumns,
      };

      /*
      if(i)
        columns.push([proprietarioCol, autoreCol, operaCol, altroCol])
      else
        columns.push([autoreCol, operaCol, altroCol])
      */
      columns.push([imageCol, proprietarioCol, autoreCol, operaCol, altroCol]);
      if (application != "techne")
        columns.push([copiesCol, tiraturaCol]);
    }
    return columns;
  }, [t]);
  //console.log(columns[0])

  const masterChange = (e, el) => {
    console.error("masterChange " + el);
    setMasterOnly(el);
  };

  const onSubmit = () => {
    history.push("/newdossier");
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
