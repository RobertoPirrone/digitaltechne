import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Footer } from "./Footer";
import logo from "/DT-noalpha.png";
//import logosa from './Smartars.png';

export function LandingPage() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  //changeLanguage(i18n.language);

  const infoUrl = process.env.REACT_APP_BE + "static/info.html";
  const app_instance = process.env.REACT_APP_INSTANCEE;

  return (
    <div id="HomeDiv">
      <div className="Home-header">
        <div id="languageDiv">
          <button onClick={() => changeLanguage("de")}>
            <img src="https://flagcdn.com/h24/de.png" height="24" width="48" alt="Deutsch" title="Deutsch" />
          </button>
          <button onClick={() => changeLanguage("en")}>
            <img src="https://flagcdn.com/h24/gb.png" height="24" width="48" alt="English" title="English" />
          </button>
          <button onClick={() => changeLanguage("it")}>
            <img src="https://flagcdn.com/h24/it.png" height="24" width="48" alt="Italiano" title="Italiano" />
          </button>
        </div>
        <img src={logo} className="xxxxApp-logo" alt="logo digitaltechne" />
        <div className="margintop30">
          <p>
            {t("Benvenuto")} su <big>DigitalTechne {app_instance}</big>
          </p>
          L'applicazione per la certificazione delle opere d'arte.
          <br />
        </div>
        <div className="asinistra margintop30">
          <p>
            Sei nuovo dell'applicazione?
            <br />
            Sul sito{" "}
            <a href="https://www.digitaltechne.it" target="_blank" rel="noreferrer">
              <b>digitaltechne.it</b>
            </a>{" "}
            puoi approfondire cosa fa l'applicazione e le sue innovative tecnologie.
          </p>
          <p>
            <Link to="/login">{t("Accedi")}</Link>
            <br />
            <Link to="/register">{t("Registrati")}</Link>
          </p>
          Prima di registrarti sulla piattaforma,{" "}
          <a href={infoUrl} rel="noreferrer">
            leggi le info ai nuovi utenti
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
