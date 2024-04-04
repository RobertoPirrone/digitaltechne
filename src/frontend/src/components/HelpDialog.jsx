import React from 'react';
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import { useLocation } from "react-router-dom";

// Messo fuori dal componente principale, si evita il rerender (e quindi il defocus) a ogni keystroke: https://stackoverflow.com/a/56760741

export default function HelpDialog(props) {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation(["help","translation"]);
  let location = useLocation().pathname.substr(1);
  let slash = location.indexOf("/");
  if(slash !== -1)
    location = location.substr(0,slash);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // console.log("props: " + JSON.stringify(props));
  //console.log("FormDialog luogo ",luogo);
  return (
  <React.Fragment>
   <Tooltip title={t("Aiuto")}>
    <IconButton
        onClick={handleClickOpen}
        color="inherit"
    >
        <HelpIcon />
    </IconButton>
   </Tooltip>
      <Dialog id="form-dialog" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{props.what}</DialogTitle>
        <DialogContent>
          {t("help:" +location)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            {t("translation:Chiudi")}
          </Button>
        </DialogActions>
      </Dialog>
  </React.Fragment>
  );
}
