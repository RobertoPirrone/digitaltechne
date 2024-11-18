// AuthContext.js
import React, { createContext, useState } from "react";

const GlobalContext = createContext();

const app = import.meta.env.VITE_APPLICATION;

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
    case "digitaltechne":
        application = "digitaltechne";
        autore = "DigitalTechne sagl";
        logo = "/DT-noalpha.png";
        officialURL = "https://digitaltechne.ch";
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
    const [userName, setUserName] = useState('')

    return <GlobalContext.Provider value={{ application, autore, logo, officialURL, userName, setUserName }}>{children}</GlobalContext.Provider>;
};

export { GlobalProvider, GlobalContext };
