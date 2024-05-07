import React, { useState, useEffect, }  from 'react';
import { useTranslation } from "react-i18next";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import Draggable from 'react-draggable';
import Paper from '@mui/material/Paper';
import { useLocation } from "react-router-dom";
// import { getLang } from "../i18n";


function getLocation(rawlocation) {
  let uri_array = rawlocation.pathname.split("/");
  let location = uri_array[1]
    // console.log("getLocation returns: ", location);
  return location
}
export function getFullManualUrl(lang) {
  // const fullManualUrl = app_server_url + '/Docs/' + lang + '/USER_MANUAL/USER_MANUAL.html?'+window._env_.FE_VERSION
  const fullManualUrl = 'UserManual.pdf'
  return fullManualUrl
}
function getManualUrl(lang,fullManualUrl,location) {
    if(location === "")
        return fullManualUrl
    const manualUrl = `html/USER_MANUAL/${location}/${location}.html`
    console.log(manualUrl);
    return manualUrl
}
function getBodyHeight() {
    const body = document.body
    const html = document.documentElement
    const height = Math.max( body.scrollHeight, body.offsetHeight,
                    html.clientHeight, html.scrollHeight, html.offsetHeight )
    return height
}

export function HelpIframe (props) {
  const { i18n } = useTranslation();
  const location = getLocation(useLocation())
  // const lang = getLang(i18n.language);
  const lang = "it";
  const fullManualUrl = getFullManualUrl(lang)
  let manualUrl
  if (props.fullManual) 
    manualUrl = fullManualUrl
  else
     manualUrl = getManualUrl(lang,fullManualUrl,location)
  const iw=600-15-6
  const ih=getBodyHeight()-15-48-6
  return (
    <iframe style={{ border: 0, padding: 4 }} id="helpIframeInDrawer" title="help iframe" width={iw} height={ih} src={manualUrl} />
  )
}

export default function HelpDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = useState(null)
  const { t, i18n } = useTranslation();
  const location = getLocation(useLocation())
  const lang = "it";
  // const lang = getLang(i18n.language)
  const fullManualUrl = getFullManualUrl(lang)
  const manualUrl = getManualUrl(lang,fullManualUrl,location)

  useEffect(() => {
        const setIframeHeight1 = () => {
            try {
              // dipende da dimensione dialog: con sm 552 x 415
              let ih = 415 - 44
              let iw = 552
              // per firefox
              ih -= 2;
              iw -= 2;
              // menu react
              ih -= 64;
              setSize([iw,ih])
              let iframe = document.getElementById("helpIframe");
              if (iframe) {
                  iframe.style.height = '' + ih + 'px';
                  iframe.style.width = '' + iw + 'px';
              }
            } catch (e) {
              log.error('setIframeHeight1', e);
            }
        }
        setIframeHeight1();
  }, [])

  function PaperComponent(props) {
      return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
          <Paper {...props} />
        </Draggable>
      );
  }

  const handleClickOpen = () => {
    if(props.emptyMode || !props.openHelpInDrawer)
        setOpen(true)
    else
        props.openHelpInDrawer()
  };
  const handleClose = () => {
    setOpen(false);
  };

  const fullManual = () => {
    window.open(fullManualUrl,'wt3_manual')
  }

  let iw = 800
  let ih = 600
  if(size) {
    iw = size[0]
    ih = size[1]
  }

  // log.debug("props: " + JSON.stringify(props));
  //log.debug("FormDialog luogo ",luogo);

  // xxxx https://wt3.mostapps.it/Docs/USER_MANUAL/USER_MANUAL.html

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
   <Dialog 
        id="helpDialog"
        open={open}
        scroll="paper"
        maxWidth="sm"
        fullWidth={true}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {t("Manuale utente")} ( {location} )
        </DialogTitle>
        <DialogContent>
          <div>
            <iframe style={{ border: 0 }} id="helpIframe" title="help iframe" width={iw} height={ih} src={manualUrl} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={fullManual} variant="outlined" color="secondary">
            {t("Manuale completo")}
          </Button>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            {t("Chiudi")}
          </Button>
        </DialogActions>
   </Dialog>
  </React.Fragment>
  );
}
