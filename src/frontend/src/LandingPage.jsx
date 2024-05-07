import React from "react";
import Container from "@mui/material/Container";
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
  const infoUrl = "/html/MISC/first_info.html";
  const app_instance = process.env.REACT_APP_INSTANCEE;

  return (
    <div id="HomeDiv">
      <Container maxWidth="md">
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
        <img src={logo} width={400} className="xxxxApp-logo" alt="logo digitaltechne" />
        <div className="margintop30">
          <p>
            {t("Benvenuto")} <big>DigitalTechne {app_instance}</big>
          </p>
            {t("Benvenuto2")}
          <br />
        </div>
        <div className="asinistra margintop30">
          <p>
            <br />
            {t("ToKnowMore2")}
            <a href="/digitaltechne_site/index.html" target="_blank" rel="noreferrer"> <b>{t("SiteName")}</b> </a>
            {t("ToKnowMore3")}
          </p>
          <p>
            <Link to="/login">{t("Accedi")}</Link>
          </p>
            {t("ReadFirstInfo")}
          <a href={infoUrl} target="_blank" rel="noreferrer">
            {t("ReadFirstInfo2")}
          </a>
            <p></p>
        </div>
      </div>
      </Container>
      <Footer />
    </div>
  );
}
