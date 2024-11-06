import Container from "@mui/material/Container";
import React, {useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { GlobalContext } from "./Global";
// import logo from "/DT-noalpha.png";
// import logo from "/Liliana Gramberg.jpg";
import { Footer } from "./Footer";
//import logosa from './Smartars.png';
import { useAuth } from "./auth/use-auth-client";

export function LandingPage() {
    const { isAuthenticated, identity } = useAuth();
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    const infoUrl = "/html/MISC/first_info.html";
    const logo = useContext(GlobalContext).logo;
    const autore = useContext(GlobalContext).autore;
    const officialURL = useContext(GlobalContext).officialURL;

    // <Micro components. More readable code> below
    const Welcome = () => {
        return ( <p>{t("Benvenuto")} <big> {autore} </big> {t("Benvenuto2")}</p>)
    };

    const KnowMoreArtist = () => {
        return (
            <p>
                {t("ToKnowMoreArtist")} {autore}{t("ToKnowMoreArtist2")}
                <a href={officialURL}  target="_blank" rel="noreferrer">
                    <b>{t("SiteName")}</b>
                </a>
            </p>
        )
    };

    const KnowMoreDigitalTechne = () => {
        return (<>
            {t("ToKnowMore2")}
            <a href="https://digitaltechne.ch" target="_blank" rel="noreferrer"> {" "} <b>{t("SiteName")}</b>{" "} </a>
            {t("ToKnowMore3")} {t("ReadFirstInfo")}
            <a href={infoUrl} target="_blank" rel="noreferrer"> {t("ReadFirstInfo2")} </a>
        </>)
    };

    const LangButton = ({lang, flag=lang, alt}) => {
        const flagPng = `https://flagcdn.com/h24/${flag}.png`;
        return (
            <button type="button" onClick={() => changeLanguage(`${lang}`)}>
                <img src={flagPng} height="24" width="48" alt={alt} title={alt} />
            </button>
        )
    };
    // <Micro components/>

    return (
        <div id="HomeDiv">
            <Container maxWidth="md">
                <div className="Home-header">
                    <div id="languageDiv">
                        <LangButton lang="it" alt="Italiano" />
                        <LangButton lang="en" flag="gb" alt="English" />
                        <LangButton lang="de" alt="Deutsch" />
                    </div>

                    <img src={logo} alt="logo digitaltechne" />
                    <Welcome/>

                    <p>{isAuthenticated ? <Link to="/home">{t("GoHome")}</Link> : <Link to="/login">{t("Accedi")}</Link>}</p>

                    <div>
                        <KnowMoreArtist/>
                        <KnowMoreDigitalTechne/>
                    </div>
                </div>
            </Container>
            <Footer />
        </div>
    );
}
