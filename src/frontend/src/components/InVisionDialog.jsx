import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
// import VisibilityIcon from '@mui/material/Visibility';
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";
import { Table } from "../Table";
import { dmy } from "../Utils";

// Visualizzazione dei dossier correntemente in visione
export default function InVisionDialog(props) {
  let n = props.inVisionRows.length;
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation(["help"]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const columns = useMemo(() => {
    const cols = [
      {
        Header: "ospite",
        accessor: "target_user",
      },
      {
        Header: "scadenza",
        accessor: "expire",
        Cell: ({ cell: { value }, row: { original } }) => {
          let s = "";
          if (value) s = dmy(value);
          return <span>{s}</span>;
        },
      },
    ];
    return cols;
  }, []);

  return (
    <React.Fragment>
      <Tooltip title={t("Controlla gli utenti")}>
        <IconButton onClick={handleClickOpen} color="inherit">
          <VisibilityIcon /> <span className="fontSizeSmall">({n})</span>
        </IconButton>
      </Tooltip>
      <Dialog id="form-dialog" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t("DossierInVisione")}</DialogTitle>
        <DialogContent>
          <Table columns={columns} data={props.inVisionRows} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            {t("translation:Chiudi")}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
