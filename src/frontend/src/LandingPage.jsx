import React from "react";
import Container from "@mui/material/Container";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Footer } from "./Footer";
// import logo from "/DT-noalpha.png";
import logo from "/Liliana Gramberg.jpg";
//import logosa from './Smartars.png';
import { useAuth} from "./auth/use-auth-client";


export function LandingPage() {
  const { isAuthenticated, identity } = useAuth();
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
        <img src={logo} className="xxxxApp-logo" alt="logo digitaltechne" />
        <div className="margintop30">
          <p>
            {t("Benvenuto")} <big> {t("WelcomeTarget")}, </big>
            {t("Benvenuto2")} 
            </p>
        </div>

          <p>
            {isAuthenticated ? (
            <Link to="/home">{t("GoHome")}</Link>
            ) : (
            <Link to="/login">{t("Accedi")}</Link>
            )}
          </p>

        <div xxclassName="asinistra margintop30">
          <p>
            {t("ToKnowMoreLiliana")} 
                  <a href="https://lilianagramberg.com" target="_blank" rel="noreferrer"> <b>{t("SiteName")}</b> </a>
          </p>

          <p>
            {t("ToKnowMore2")}
            <a href="https://digitaltechne.ch" hhhref="/digitaltechne_site/index.html" target="_blank" rel="noreferrer"> <b>{t("SiteName")}</b> </a>
            {t("ToKnowMore3")}
            {t("ReadFirstInfo")}
          <a href={infoUrl} target="_blank" rel="noreferrer">
            {t("ReadFirstInfo2")}
          </a>
          </p>
        </div>
      </div>
      </Container>
      <Footer />
    </div>
  );
}
