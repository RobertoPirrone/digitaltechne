// AuthContext.js
import React, { createContext, useState } from 'react';

const GlobalContext = createContext();

const app = process.env.DFX_APPLICATION;

let globalOptions = {};

switch (app) {
    case 'gramberg':
        globalOptions = {
            application: 'gramberg',
            autore: 'Liliana Gramberg',
            logo: '/Liliana Gramberg.jpg'
        };
    case 'valsecchi':
        globalOptions = {
            application: 'valsecchi',
            autore: 'Liliana Gramberg',
            logo: '/Liliana Gramberg.jpg'
        };
    default:
        console.error(`UNKNOWN application ${app}`);
}

const GlobalProvider = ({ children }) => {

    // console.log("ENV: ");
    // console.log(JSON.stringify(process.env));

  return (
    <GlobalContext.Provider value={{ globalOptions }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider, GlobalContext };
