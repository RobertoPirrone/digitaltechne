/**
 * Select multilingua specifica per un campo
 *
 * Per dettagli leggere il tutorial sulla nostra gestine Multilingua {@tutorial MultiLanguage}
 *
 * gestisce anche pulldown a 2 livelli (prima si chiamava DoubleLevelSelect)
 *
 * Ideas from: https://mui.com/material-ui/react-select/#grouping, https://stackoverflow.com/questions/62455161/loop-through-array-and-create-a-listitem-for-each-item
 *
 * @module SpecializedSelect
 */

import { FormControl } from "@mui/base/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
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
    console.log(JSON.stringify(objs));
    //rows.push(<MenuItem key={"None"} value=""> <em>None</em> </MenuItem>);
    let k = "";
    let lev2Name = "";
    for (const ele of Object.entries(objs)) {
        console.log("ele: ", JSON.stringify(ele));
        const [key, value] = ele;
        if (value.constructor === Object) {
            lev2Name = value.Name;
            value.Name = undefined;
            rows.push(
                <MyListSubheader value={lev2Name} key={lev2Name}>
                    {lev2Name}
                </MyListSubheader>,
            );
            for (const innerEle of Object.entries(value)) {
                const [ikey, ivalue] = innerEle;
                k = `${key}.${ikey}`;
                rows.push(
                    <MenuItem value={k} key={k}>
                        {ivalue}
                    </MenuItem>,
                );
            }
            continue;
        }
        rows.push(
            <MenuItem key={key} value={key}>
                {value}
            </MenuItem>,
        );
    }
    console.log(rows);
    return (
        <>
            <InputLabel id="demo-simple-select-required-label">{label}</InputLabel>
            <Select labelId="demo-simple-select-required-label" id="demo-simple-select-required" defaultValue={defaultValue} label={label} onChange={onChange}>
                {rows}
            </Select>
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
    return <ComputeSelectRows what={what} label={label} defaultValue={defaultValue} onChange={onChange} />;
};
