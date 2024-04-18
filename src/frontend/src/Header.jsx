import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
//import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
//import logosa from './Smartars.png';
import logo from "./DT-noalpha.png";
import { DTGrow, DTMenuButton, DTHeaderTitle, DTSectionUser } from "./components/useStyles";
import HelpDialog from "./components/HelpDialog";
import LanguageIcon from "@mui/icons-material/Language";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import { useGlobalState } from "./state";

export function Header(props) {
  const { t, i18n } = useTranslation();
  const [langDialog, setLangDialog] = useState(false);
  const [ username, setUsername ] = useGlobalState("username");

  function linguaWin() {
    setLangDialog(true);
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose1 = () => {
    setAnchorEl1(null);
  };

  /*
  const helpWin = () => {
    console.log("path: ", router_loc.pathname);
    console.log("process.env: ", process.env);
    appConfirm(t('Premi OK per visualizzare la documentazione'),() => {
    let doc = process.env.REACT_APP_SERVER + '/OpusDocs';
    alert(doc);
    window.open(doc, '_blank');
    // window.open('https://smartars.mostapps.it/OpusDocs', '_blank');
    });
  };
  */

  // const classes = useStyles();

  const catalogoUrl = "/catalogo.html";

  return (
    <div >
      <AppBar position="fixed" color="inherit" className="Header">
        <Toolbar>
          {props.empty === "true" ? 
          /*<Tooltip title={t("pagina iniziale")}> <Link to="/"> <IconButton className={classes.menuButton} edge="start" color="inherit" > <ArrowBackIcon /> </IconButton> </Link> </Tooltip> */
          null : (
            <Tooltip title={"menu"}> 
              <IconButton edge="start" aria-label="menu" aria-controls="user-menu" aria-haspopup="true" onClick={handleClick} color="inherit" > <MenuIcon /> </IconButton> 
            </Tooltip>
          )}
          {props.empty === "true" ? null /*(
          <Tooltip title="smartars.eu">
            <a href="https://www.smartars.eu/" rel="noreferrer" target="_blank"><img edge="end" src={logosa} alt="logo" style={{height:"40px"}} className={dt_headerTitle} /></a>
          </Tooltip>
        )*/ : (
            <Tooltip title={t("Pagina principale")}> 
                <Link to="/loginok"> <img edge="end" src={logo} alt="logo" style={{ height: "40px" }} className={DTHeaderTitle} /> </Link> 
            </Tooltip>
          )}
          <div />
          <HelpDialog />
          <Tooltip title={t("Lingua")}>
            <IconButton onClick={linguaWin} color="inherit">
              <LanguageIcon />
            </IconButton>
          </Tooltip>
          {props.empty === "true" ? null : (
            <div className={DTSectionUser}>
              <Tooltip title={"username"}> 
                <IconButton edge="end" aria-label={t("account of current user")} aria-controls="user-menu" aria-haspopup="true" onClick={handleClick1} color="inherit" > <AccountCircleIcon /> </IconButton> 
              </Tooltip>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Menu
        id="left-menu"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem component={Link} to="/loginok" onClick={handleClose}>
          {t("Pagina principale")}
        </MenuItem>
        <MenuItem component={Link} to="/dossier" onClick={handleClose}>
          {t("Dossier aperti")}
        </MenuItem>
        <MenuItem component="a" href={catalogoUrl} target="_blank" onClick={handleClose}>
          {t("Catalogo servizi")}
        </MenuItem>
        <MenuItem component={Link} to="/cert_request" onClick={handleClose}>
          {t("CertificationRequest")}
        </MenuItem>
      </Menu>
      <Menu
        id="user-menu"
        anchorEl={anchorEl1}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        open={Boolean(anchorEl1)}
        onClose={handleClose1}
      >
        <MenuItem disabled>{username}</MenuItem>
        <MenuItem component={Link} to="/identityM" onClick={handleClose1}>
          {t("I tuoi dati")}
        </MenuItem>
        <MenuItem component={Link} to="/changepasswd" onClick={handleClose1}>
          {t("Cambio password")}
        </MenuItem>
        <MenuItem component={Link} to="/logout" onClick={handleClose1}>
          {t("Logout")}
        </MenuItem>
      </Menu>
      <Dialog open={langDialog} onClose={() => setLangDialog(false)} aria-describedby="lang-alert-dialog-description">
        <DialogContent>
          <DialogContentText id="lang-alert-dialog-description">{t("Scegli la lingua")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setLangDialog(false);
              i18n.changeLanguage("it");
            }}
            color="primary"
            autoFocus
          >
            <img src="https://flagcdn.com/h24/it.png" height="24" width="48" alt="Italiano" title="Italiano" />
          </Button>
          <Button
            onClick={() => {
              setLangDialog(false);
              i18n.changeLanguage("en");
            }}
            color="primary"
            autoFocus
          >
            <img src="https://flagcdn.com/h24/gb.png" height="24" width="48" alt="English" title="English" />
          </Button>
          <Button
            onClick={() => {
              setLangDialog(false);
              i18n.changeLanguage("de");
            }}
            color="primary"
            autoFocus
          >
            <img src="https://flagcdn.com/h24/de.png" height="24" width="48" alt="Deutsch" title="Deutsch" />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
