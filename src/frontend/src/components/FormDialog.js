import React, { useState } from "react"
import { useTranslation } from "react-i18next";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import { MostButton2 } from "./MostComponents";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from "react-select";
import { useGlobalHook } from '@devhammed/use-global-hook'
import MyAxios, { check_response } from "../MyAxios";

// Messo fuori dal componente principale, si evita il rerender (e quindi il defocus) a ogni keystroke: https://stackoverflow.com/a/56760741
  const AddDialogElements = ({ what, autore, luogo, tipoopera, tipoluogoOptions, t, handlePullDownChange, handleInputChange }) => {
    if ( what === "autore") {
      return (
        <div>
        <TextField value={autore.cognome} onChange={handleInputChange} margin="dense" name="cognome" label={t("dossier:Cognome")} fullWidth />
        <TextField value={autore.nome} onChange={handleInputChange} margin="dense" name="nome" label={t("dossier:Nome")} fullWidth />
        <TextField value={autore.detto} onChange={handleInputChange} margin="dense" name="detto" label={t("dossier:detto")} fullWidth />
        </div>
      );
  } else if ( what === "tipoopera") {
      return (
        <div>
        <TextField value={tipoopera} onChange={handleInputChange} margin="dense" name="tipoopera" label={t("dossier:Tipo Opera")} fullWidth />
        </div>
      );
  } else {
      //console.log("AddDialogElements luogo ",luogo,"tipoluogoOptions",tipoluogoOptions);
      return (
        <div>
        <TextField value={luogo.citta} onChange={handleInputChange} margin="dense" name="citta" label={t("dossier:citta")} fullWidth />
        <TextField value={luogo.indirizzo} onChange={handleInputChange} margin="dense" name="indirizzo" label={t("dossier:indirizzo")} fullWidth />
        <TextField value={luogo.nazione} onChange={handleInputChange} margin="dense" name="nazione" label={t("dossier:nazione")} fullWidth />
        { /* per forzare value passare oggetto con value e label */ }
        <Select options={tipoluogoOptions} onChange={handlePullDownChange} name="tipoluogo" placeholder={t("dossier:tipoluogo")} className="MuiFormControl-marginDense blackColor" />
        </div>
      );
    }
  };

export default function FormDialog(props) {
  const [disabledButs, setDisabledButs] = useState(false)
  const [open, setOpen] = React.useState(false);
  const [luogo, setLuogo] = React.useState( {"citta":"","indirizzo":"","nazione":"","tipoluogo":""} );
  const [autore, setAutore] = React.useState( {"cognome": "", "nome": "", "detto": ""} );
  const [tipoopera, setTipoopera] = React.useState("")
  const { t } = useTranslation(["translation", "dossier"]);
  const { setAlert1, setContent } = useGlobalHook('alertStore');

  function appAlert(text) {
    setContent(text);
    setAlert1(true);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    if (props.what === "autore") {
        if(autore.cognome==="" && autore.nome==="" && autore.detto==="") {
            appAlert("Inserisci almeno un valore");
            return;
        }
    } else if (props.what === "tipoopera") {
        if(tipoopera==="") {
            appAlert("Inserisci un valore");
            return;
        }
    } else {
        if(luogo.citta==="" && luogo.indirizzo==="" && luogo.nazione==="" && luogo.tipoluogo==="") {
            appAlert("Inserisci almeno un valore");
            return;
        }
    }
    let what = props.what;
    setDisabledButs(true)
    MyAxios.post('/newsearchele', {what,autore,luogo,tipoopera})
    .then((response) => {
        response = check_response(response);
        // alert(JSON.stringify(response));
        //console.log(response);
        if(response.success) {
            setOpen(false);
            props.setSearchele(true);
            props.onInsert(what,response.id)
            if (props.what === "autore") {
                setAutore( {"cognome": "", "nome": "", "detto": ""} );
            } else if (props.what === "tipoopera") {
                setTipoopera("")
            } else {
                setLuogo( {"citta":"","indirizzo":"","nazione":"","tipoluogo":""} );
            }
        } else {
            console.error(response);
            appAlert(response.error);
        }
    })
    .catch(function (error) {
        // handle error
        console.error(error);
        appAlert(error.message?error.message:JSON.stringify(error));
    })
    .then(function () {
        setDisabledButs(false)
    });
  };

    const handlePullDownChange = (v) => {
        console.log("handlePullDownChange  --> what: " + props.what + ", Value: " + v.value + ", Label: " + v.label);
        setLuogo({...luogo, tipoluogo: v.value});
    };

  const handleInputChange = (v) => {
    console.log("handleInputChange  --> what: " + props.what + ", Name: " + v.target.name + ", Value: " + v.target.value);

    // v.persist();
    // console.log(v.target.name + ' ' + v.target.value);
    // let name = v.target.name;
    // let value = v.target.value;
    if (props.what === "autore") {
        setAutore({...autore, [v.target.name]: v.target.value});
    } else if (props.what === "tipoopera") {
        setTipoopera(v.target.value)
    } else {
        setLuogo({...luogo, [v.target.name]: v.target.value});
    }
    // console.log(autore);
    // console.log(luogo);
  };

  // console.log("props: " + JSON.stringify(props));
  //console.log("FormDialog luogo ",luogo);
  return (
    <div>
      <MostButton2 disabled={props.disabledButs} onClick={handleClickOpen} label={t("dossier:Aggiungi")} />
      <Dialog id="form-dialog" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t("dossier:"+props.what)}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Aggiungere i dati del nuovo {t("dossier:"+props.what)}
          </DialogContentText>
          <AddDialogElements what={props.what} autore={autore} luogo={luogo} tipoopera={tipoopera} tipoluogoOptions={props.tipoluogoOptions} t={t} handleInputChange={handleInputChange} handlePullDownChange={handlePullDownChange} />
        </DialogContent>
        <DialogActions>
          <Button disabled={disabledButs} onClick={handleClose} variant="outlined" color="secondary">
            {t("translation:Annulla")}
          </Button>
          <Button disabled={disabledButs} onClick={handleSubmit} variant="contained" color="primary">
            {t("translation:Aggiungi")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
