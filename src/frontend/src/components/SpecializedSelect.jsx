/**
 * Language aware Select 
 *
 * Rationale and details here: {@tutorial MultiLanguage}
 *
 * Pulldowns can have also sublevels (legacy name was DoubleLevelSelect)
 *
 * Ideas from: https://mui.com/material-ui/react-select/#grouping, https://stackoverflow.com/questions/62455161/loop-through-array-and-create-a-listitem-for-each-item
 *
 * @module SpecializedSelect
 *
 * @example: <SpecializedSelect defaultValue={""} name="tipotecnica" label={t("tipotecnica:Label")} what={"tipotecnica"} onChange={(e, v) => setTipotecnica(e.target.value)} />
 */

import { FormControl } from "@mui/base/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import React from "react";
import { useTranslation } from "react-i18next";

function MyListSubheader(props) {
    return <ListSubheader {...props} />;
}
MyListSubheader.muiSkipListHighlight = true;

const ComputeSelectRows = ({ what, label, defaultValue, onChange }) => {
    const rows = [];
    const [tipo, setTipo] = React.useState("");
    const handleChange = (event) => {
        setTipo(event.target.value);
    };
    const { t, i18n, ready } = useTranslation([`${what}`]);
    if (!ready) return "loading translations...";
    const obj2translate = `${what}:${what}_array`;
    const objs = t(obj2translate, { returnObjects: true });
    // console.log(JSON.stringify(objs));
    let k = "";
    let lev2Label = "";
    for (const ele of Object.entries(objs)) {
        // console.log("ele: ", JSON.stringify(ele));
        const [key, value] = ele;
        if (value.constructor === Object) {
            lev2Label = value.Label;
            value.Label = undefined;
            rows.push( <MyListSubheader value={lev2Label} key={lev2Label}> {lev2Label} </MyListSubheader>,);
            for (const innerEle of Object.entries(value)) {
                const [ikey, ivalue] = innerEle;
                k = `${key}.${ikey}`;
                rows.push( <MenuItem value={k} key={k}> {ivalue} </MenuItem>,);
            }
            continue;
        }
        rows.push( <MenuItem key={key} value={key}> {value} </MenuItem>,);
    }
    // console.log(`ROWS ${what}:  `);
    // console.log(rows);

    return (
        <>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="grouped-select"> {label} </InputLabel>
                <Select fullWidth defaultValue={defaultValue} label={label} onChange={onChange}>
                    <option aria-label="None" value="" />
                    {rows}
                </Select>
            </FormControl>
        </>
    );
};

/**
 * @function
 * @param {string} name nome del compo
 * @param {function} onChange
 * @param {string} label etichetta del campo
 * @param {string} what nome del file di translation
 * @param {string} defaultValue
 * @param {string} language
 * @return {JSX.Element} Select instructions
 * @example <SpecializedSelect defaultValue={""} name="tiposupporto" label={t("tiposupporto:Label")} what={"tiposupporto"} onChange={(e, v) => setTiposupporto(e.target.value)} />
 */
export const SpecializedSelect = ({ name, onChange, label, what, defaultValue, language = "it" }) => {
    return (
        <Grid item>
                <ComputeSelectRows what={what} label={label} defaultValue={defaultValue} onChange={onChange} />
        </Grid>
    )
};
