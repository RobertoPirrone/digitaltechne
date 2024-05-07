// https://forum.dfinity.org/t/dfinity-auth-client-sessionstorage/12400
// https://erxue-5aaaa-aaaab-qaagq-cai.ic0.app/auth-client/interfaces/AuthClientStorage.html
// https://github.com/dfinity/agent-js/tree/main/packages/auth-client
// https://forum.dfinity.org/t/keeping-user-logged-in-between-browser-refreshes-or-how-to-stringify-authclient-agent-actor/15035/16

import {useContext, useEffect} from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useTranslation, Trans } from 'react-i18next';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import logo from '/DT-noalpha.png';
import { DTPaper, DTForm, DTSubmit } from './components/useStyles';
import { MostSubmitButton} from './components/MostComponents';
import { canisterId, idlFactory, backend } from "../../declarations/backend";
import { myContext } from './components/MyContext';

export const Login = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const IIcanisterId = process.env.CANISTER_ID_INTERNET_IDENTITY;
    const infoUrl = "/html/MISC/first_info.html";
    const [ whoami, setWhoami, backendActor, setBackendActor, assetPfx, setAssetPfx ] = useContext(myContext);

    async function InternetIdentityLogin() {
        let authClient = await AuthClient.create();
        await new Promise((resolve) => {
            authClient.login({
                // 7 days in nanoseconds
                maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
                identityProvider:
                    process.env.DFX_NETWORK === "ic"
                        ? "https://identity.ic0.app"
                        : `http://${IIcanisterId}.localhost:4943`
            });

            const identity = authClient.getIdentity();
            let agent = new HttpAgent({ identity, });
            const actor = Actor.createActor(idlFactory, {
              agent: agent,
              canisterId,
            });
            console.log("IIprincipal: ",  identity.getPrincipal().toText());
            if (process.env.DFX_NETWORK !== "ic") {
                    agent.fetchRootKey();
            }
            actor.whoami().then((Ok_data) =>  {
                console.log("InternetIdentityLogin, whoami returns: ",Ok_data);
                setWhoami(Ok_data);
                localStorage.setItem("whoami", Ok_data);
            })
            setBackendActor(actor);
            navigate("/dossier");
        });
    }

    return (
    <Container component="main" maxWidth="xs">
      <div className={DTPaper}>
        <img src={logo} width={400} className="XXXApp-logo" alt="logo" />
        <Typography component="h1" variant="h5"> <Trans i18nKey="techneTitle" /> </Typography>
        <div className="w-1/2 mb-4"> 
          <MostSubmitButton onClick={async () => await InternetIdentityLogin()} className="makeStyles-submit-4" label={t('SignIn.Sign In')}/>
        </div>
          <Grid container>
            <br />
            <br />
            <Grid item xs={12}>
                <a href={infoUrl} rel="noreferrer">
                {t('Clicca qui per help e informazioni')}
              </a>
            </Grid>
          </Grid>
      </div>
    </Container>
  ) 
};

export const Logout = async () => {
    const [ whoami, setWhoami, backendActor, setBackendActor, assetPfx, setAssetPfx ] = useContext(myContext);
    const navigate = useNavigate();

        setBackendActor(null);
        setWhoami("");
        localStorage.setItem("whoami", "");
        let authClient = await AuthClient.create();
        authClient.logout({ returnTo: "/login" });

        navigate("/login");
};


export function checkLoggedUser () {
    const [ whoami, setWhoami, backendActor, setBackendActor, assetPfx, setAssetPfx ] = useContext(myContext);
    //let authClient = await AuthClient.create();
    let authClient = null;
    AuthClient.create()
        .then((response) => {
            authClient = response;
            const identity = authClient.getIdentity();

            if ( ! authClient.isAuthenticated()) {
                navigate("/login");
            } else {
                if ( ! identity.getPrincipal().isAnonymous() ) {
                    console.log( `checkLoggedUser non anonimo, identity ${identity}, whoami ${whoami}`);
                    const principal = identity.getPrincipal().toText();
                    if (backendActor !== null && principal != "2vxsx-fae") {
                        console.log( "checkLoggedUser non anonimo, principal: ", principal);
                        return principal;
                    }
                }

                console.log( "checkLoggedUser identity: ", identity);
                let agent = new HttpAgent({ identity, });
                const actor = Actor.createActor(idlFactory, {
                  agent: agent,
                  canisterId,
                });
                setBackendActor(actor);
                console.log("IIprincipal: ",  identity.getPrincipal().toText());
                if (process.env.DFX_NETWORK !== "ic") {
                        agent.fetchRootKey();
                }
                actor.whoami().then((Ok_data) =>  {
                    console.log("InternetIdentityLogin, whoami returns: ",Ok_data);
                    setWhoami(Ok_data);
                    localStorage.setItem("whoami", Ok_data);
                    return Ok_data;
                })
            }
        });
}

export const getBackendActor = async () => {
    const [ whoami, setWhoami, backendActor, setBackendActor, assetPfx, setAssetPfx ] = useContext(myContext);
    if (backendActor !== null)  {
        console.log("ritorno backendActor");
        return backendActor;
    }

    console.log("DENTRO LA INNER,  PASSO DI QUI");
}

