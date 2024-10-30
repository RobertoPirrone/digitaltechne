// AuthContext.js
import React, { createContext, useState } from "react";

const GlobalContext = createContext();

const app = process.env.DFX_APPLICATION;

let application;
let autore;
let logo;
switch (app) {
    case "gramberg":
        application = "gramberg";
        autore = "Liliana Gramberg";
        logo = "/Liliana Gramberg.jpg";
        break;
    case "valsecchi":
        application = "valsecchi";
        autore = "Carlo Valsecchi";
        logo = "/Carlo Valsecchi.jpeg";
        break;
    default:
        console.error(`UNKNOWN application ${app}`);
}

const GlobalProvider = ({ children }) => {

    return <GlobalContext.Provider value={{ application, autore, logo }}>{children}</GlobalContext.Provider>;
};

export { GlobalProvider, GlobalContext };
