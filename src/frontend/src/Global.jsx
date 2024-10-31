// AuthContext.js
import React, { createContext, useState } from "react";

const GlobalContext = createContext();

const app = process.env.REACT_APP_APPLICATION;

let application;
let autore;
let logo;
let officialURL;
switch (app) {
    case "gramberg":
        application = "gramberg";
        autore = "Liliana Gramberg";
        logo = "/Liliana Gramberg.jpg";
        officialURL = "https://lilianagramberg.com";
        break;
    case "valsecchi":
        application = "valsecchi";
        autore = "Carlo Valsecchi";
        logo = "/Carlo Valsecchi.jpeg";
        officialURL = "https://www.ababo.it/courses-and-subjects/teachers-index/carlo-valsecchi";
        break;
    default:
        console.error(`UNKNOWN application ${app}`);
}

const GlobalProvider = ({ children }) => {

    return <GlobalContext.Provider value={{ application, autore, logo, officialURL }}>{children}</GlobalContext.Provider>;
};

export { GlobalProvider, GlobalContext };
