/** @module Utils */
import { canisterId } from "../../declarations/uploads";
import React, { useCallback } from "react";

/**
 * yyyy-mm-dd -> dd/mm/yyyy
 *
 * @function
 * @param   {string} s 
 * @return  {string}            
 */
export const dmy = (s) => {
    return s.substring(8) + "/" + s.substring(5, 7) + "/" + s.substring(0, 4);
};

/**
 * conversione in json 
 *
 * @function
 * @param   {object} obj 
 * @param   {bool} nl2br return newline HTML friendly  (e.g. <br>)
 * @param   {bool} preformatted return is inclosed in <pre> tag
 * @return  {string}            
 */
export const prettyJson = (obj, preformatted, nl2br) => {
    let pretty = JSON.stringify(obj, null, 2);
    if (nl2br) pretty = pretty.replace(/[\n]/g, "<br>");
    if (preformatted)
        pretty = `<pre>${pretty}</pre>`;
    return pretty;
};

/**
 * ritorna false per tutte le app in mainnet
 *
 * @function
 * @return  {bool}            isLocal
 */
export const isLocalHost = () => {
    let isLocal = true;
    const host = window.location.host;
    if (host.endsWith("icp0.io") || host.endsWith("mostapps.it") || host.endsWith("mostapps.ch")) isLocal = false;
    return isLocal;
};

/**
 * prefisso URL delle immagini, a seconda che sia in locale o mainnet
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
 * ritorna data nazionalizzata. isoStamp è iso8601
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
