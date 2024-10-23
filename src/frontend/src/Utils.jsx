/** @module Utils */
import React, { useCallback } from "react";
import { canisterId } from "../../declarations/uploads";

import { MyCheckIcon } from "./components/MostComponents";

/**
 * yyyy-mm-dd -> dd/mm/yyyy
 *
 * @function
 * @param   {string} s
 * @return  {string}
 */
export const dmy = (s) => {
    return `${s.substring(8)}/${s.substring(5, 7)}/${s.substring(0, 4)}`;
};

/**
 * Json pretty print
 *
 * @function
 * @param   {object} obj
 * @param   {bool} nl2br convert newline to HTML friendly  (e.g. <br>)
 * @param   {bool} preformatted return is enclosed in <pre> tag
 * @return  {string}
 */
export const prettyJson = (obj, preformatted, nl2br) => {
    let pretty = JSON.stringify(obj, null, 2);
    if (nl2br) pretty = pretty.replace(/[\n]/g, "<br>");
    if (preformatted) pretty = `<pre>${pretty}</pre>`;
    return pretty;
};

/**
 * true if local, false for Mainnet
 *
 * @function
 * @return  {bool}            isLocal
 */
export const isLocalHost = () => {
    let isLocal = true;
    const host = window.location.host;
    if (host.endsWith("icp0.io") || host.endsWith("mostapps.it") || host.endsWith("digitaltechne.ch")) isLocal = false;
    return isLocal;
};

/**
 * URL prefix for the assrt images, handling local/mainnet
 *
 * @function
 * @return  {string}            asset_prefix
 */
export const getAssetPfx = () => {
    // const isLocal = !window.location.host.endsWith("icp0.io");
    let asset_pfx = `https://${canisterId}.icp0.io`;
    if (isLocalHost()) {
        asset_pfx = `http://${canisterId}.localhost:4943`;
    }
    console.log("asset_pfx :", asset_pfx);
    return asset_pfx;
};

export const appAlert = (text) => {
    console.error(text);
    alert(text);
};

/**
 * from iso8601 string to localized date
 *
 * @function
 * @param   {string} isoStamp  timestamp
 * @param   {string} lang   language, f.i. "en-US"
 * @return  {string}            localized date + time, f.i. "Oct 8, 2024, 4:36 PM"
 */
export const prettyDate = (isoStamp, lang) => {
    const ora = new Date(isoStamp);
    const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };

    const dataora = ora.toLocaleString(lang, options);
    console.log(dataora);
    return dataora;
};

export const fillIconField = (field, headerName) => {
    return {
        flex: 1,
        headerName: headerName,
        field: field,
        renderCell: (params) => {
            const field_value = eval(`params.row.${field}`);
            return <MyCheckIcon value={field_value} />;
        },
    };
};
