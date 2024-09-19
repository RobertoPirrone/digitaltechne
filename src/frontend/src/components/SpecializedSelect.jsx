// Select multilingua specifica per un campo
// gestisce anche pulldown a 2 livelli (prima si chiamava Double    LevelSelect)

//https://mui.com/material-ui/react-select/#grouping
// https://stackoverflow.com/questions/62455161/loop-through-array-and-create-a-listitem-for-each-item

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


const ComputeSelectRows = ({
    what,
    label,
    defaultValue,
    onChange
}) => {

var rows = [];
const [tipo, setTipo] = React.useState('');
const handleChange = (event) => { setTipo(event.target.value); };
const { t, i18n, ready } = useTranslation([`${what}`]);
    if (!ready) return "loading translations...";
    let obj2translate= `${what}:${what}_array`;
    const objs = t(obj2translate, { returnObjects: true });
    console.log(JSON.stringify(objs));
    //rows.push(<MenuItem key={"None"} value=""> <em>None</em> </MenuItem>);
    var k = "";
    var lev2Name = "";
    for (const ele of Object.entries(objs)) {
        console.log("ele: ", JSON.stringify(ele));
        const [key, value] = ele;
        if (value.constructor === Object) {
            lev2Name = value.Name;
            delete value.Name;
            rows.push( <MyListSubheader value={lev2Name} key={lev2Name} >{lev2Name}</MyListSubheader>);
            for (const innerEle of Object.entries(value)) {
                const [ikey, ivalue] = innerEle;
                k=`${key}.${ikey}`
                rows.push( <MenuItem value={k} key={k} >{ivalue}</MenuItem>);
            }
            continue;
        }
        rows.push( <MenuItem key={key} value={key} >{value}</MenuItem>);
    }
      console.log(rows);
            return (
                <>
        <InputLabel id="demo-simple-select-required-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          defaultValue={defaultValue}
          label={label}
          onChange={onChange}
        >
                {rows}
        </Select>
                </>
            );
};

export const SpecializedSelect = ({
  name,
  onChange,
  label,
  what,
  defaultValue,
  language = "it",
}) => {

return (
        <ComputeSelectRows what={what} label={label} defaultValue={defaultValue} onChange={onChange}/>
)
};
