import React from "react";
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import ListSubheader from '@mui/material/ListSubheader';
import OutlinedInput from '@mui/material/OutlinedInput';
import { FormControl } from '@mui/base/FormControl';
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";

function MyListSubheader(props) {
  return <ListSubheader {...props} />;
}
MyListSubheader.muiSkipListHighlight = true;


const ComputeItems = ({
    onChange
}) => {

var rows = [];
const [tipo, setTipo] = React.useState('');
const handleChange = (event) => { setTipo(event.target.value); };

const { t, i18n, ready } = useTranslation(["translations", "document_taxonomy"]);
    if (!ready) return "loading translations...";
    const tipodoc = t("document_taxonomy:document_taxonomy_array", { returnObjects: true });
    // console.log(JSON.stringify(tipodoc));
    rows.push(<MenuItem key={"None"} value=""> <em>None</em> </MenuItem>);
    for (const ele of Object.entries(tipodoc)) {
        // console.log("ele: ", JSON.stringify(ele));
        const [key, value] = ele;
        if (value.constructor === Object) {
            rows.push( <MyListSubheader value={key} key={key} >{key}</MyListSubheader>);
            for (const innerEle of Object.entries(value)) {
                const [ikey, ivalue] = innerEle;
                rows.push( <MenuItem value={ikey} key={ikey} >{ivalue}</MenuItem>);
            }
            continue;
        }
        rows.push( <MenuItem key={key} value={key} >{value}</MenuItem>);
    }
      console.log(rows);
            return (
                <FormControl required sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-required-label">{t("TipoDocumento")}</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          label="Age *"
          onChange={onChange}
        >
                {rows}
        </Select>
      </FormControl>
            );
};

export const DoubleLevelSelect = ({
  name,
  onChange,
  label,
  options,
  language = "it",
}) => {

return (
        <ComputeItems onChange={onChange}/>
)
};
