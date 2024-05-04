//https://forum.dfinity.org/t/dfinity-auth-client-sessionstorage/12400
//https://erxue-5aaaa-aaaab-qaagq-cai.ic0.app/auth-client/interfaces/AuthClientStorage.html
// https://github.com/dfinity/agent-js/tree/main/packages/auth-client
// https://forum.dfinity.org/t/keeping-user-logged-in-between-browser-refreshes-or-how-to-stringify-authclient-agent-actor/15035/16

import {useEffect} from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useTranslation, Trans } from 'react-i18next';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { useGlobalState } from './state';
import logo from '/DT-noalpha.png';
import { DTPaper, DTForm, DTSubmit } from './components/useStyles';
import { MostSubmitButton} from './components/MostComponents';
import { canisterId, idlFactory, backend } from "../../declarations/backend";

// ricostruisce l'actor che parla con il Backend, con IIdentity e lo mette in GlobalState
const AuthBackendActor = (authClient) => {
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
    console.log(JSON.stringify(actor));
    actor.whoami().then((Ok_data) =>  {
        // console.log("whoami returns: ",JSON.stringify(Ok_data));
        console.log("whoami returns: ",Ok_data);
    });
    return actor;
}
export const Login = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const IIcanisterId = process.env.CANISTER_ID_INTERNET_IDENTITY;
    const [username, setUsername] = useGlobalState('username');
    const [backend, setBackend] = useGlobalState('backend');
    const [backendActor, setBackendActor] = useGlobalState('backendActor');
    const infoUrl = "/html/MISC/first_info.html";

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
            console.log("Login prima di localStorage.setItem: ", JSON.stringify(actor));
            setBackend(actor);
            setBackendActor(actor);
            localStorage.setItem("backendActor", JSON.stringify(actor));
            localStorage.setItem("identity", identity);
            navigate("/dossier");
        });
    }

    return (
    <Container component="main" maxWidth="xs">
      <div className={DTPaper}>
        {/*
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        */}
        <img src={logo} width={400} className="XXXApp-logo" alt="logo" />
        <Typography component="h1" variant="h5">
          <Trans i18nKey="techneTitle" />
        </Typography>
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

export const Logout = () => {
        // let authClient = await AuthClient.create();
    // await authClient.logout({
      // onSuccess: () =>{
        // console.log("logged out");
      // }
    // })

    const [username, setUsername] = useGlobalState('username');
    const [backendActor, setBackendActor] = useGlobalState('backendActor');
    const navigate = useNavigate();

    useEffect(() => {
        setUsername("");
        setBackendActor(null);
        localStorage.removeItem("backendActor");
        navigate("/login");
    })

  // This fix a "sign in -> sign out -> sign in again" flow without window reload.
  // authClient = null;
};


export const checkLoggedUser = () => {
  const [username, setUsername] = useGlobalState('username');
  // const [backendActor, setBackendActor] = useGlobalState('backendActor');
  const backendActor = getBackendActor();
    console.log("checkLoggedUser backendActor: ", JSON.stringify(backendActor));
    console.log("checkLoggedUser backendActor: ", backendActor);
    backendActor.whoami().then((Ok_data) =>  {
        console.log("whoami returns: ",Ok_data);
        setUsername(Ok_data);
        return Ok_data;
    })
}

export const getBackend = () => {
    const [backend, setBackend] = useGlobalState('backend');
    if (backend !== null ) {
        return backend
    } else {
    (async () => {
      const client = await AuthClient.create();
      if (client.isAuthenticated()) {
          console.log("backend is ", backend);
                if (backend === null || backend == "") {
            const identity = client.getIdentity();
            const actor = Actor.createActor(idlFactory, {
              agent: new HttpAgent({
                identity,
              }),
              canisterId,
            });
      setBackend(actor);
      return actor;
                }
      } else {
                    async () => await InternetIdentityLogin();
      setBackend(actor);
      return actor;
      }
    })();
    }
}
export const getBackendActor = () => {
    return backend
}
