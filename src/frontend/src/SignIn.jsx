import {useEffect} from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useTranslation, Trans } from 'react-i18next';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { useGlobalState } from './state';
import logo from './DT-noalpha.png';
import { DTPaper, DTForm, DTSubmit } from './components/useStyles';
import { MostSubmitButton} from './components/MostComponents';
import { backend } from "../../declarations/backend";

export const Login = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const IIcanisterId = process.env.CANISTER_ID_INTERNET_IDENTITY;
    const [username, setUsername] = useGlobalState('username');
    const infoUrl = "/info.html"
    // console.log(JSON.stringify(i18n));


    async function InternetIdentityLogin() {
        let authClient = await AuthClient.create();
        await new Promise((resolve) => {
            authClient.login({
                identityProvider:
                    process.env.DFX_NETWORK === "ic"
                        ? "https://identity.ic0.app"
                        : `http://${IIcanisterId}.localhost:4943`
            });
            if (false) {
            const IIidentity = authClient.getIdentity();
            console.log(IIidentity);
            setIdentity(IIidentity);
            const IIprincipal = authClient.getIdentity().getPrincipal();
            console.log("principal: ", IIprincipal);

            const IIagent = new HttpAgent({ identity });
            console.log(JSON.stringify(IIagent));
            setAgent(IIagent);
            }
            backend.whoami().then((Ok_data) =>  {
                // console.log("whoami returns: ",JSON.stringify(Ok_data));
                console.log("whoami returns: ",Ok_data);
                setUsername(Ok_data);
                navigate("/dossier");
            });
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
        <img src={logo} className="XXXApp-logo" alt="logo" />
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
    const navigate = useNavigate();

    useEffect(() => {
        setUsername("");
        navigate("/login");
    })

  // This fix a "sign in -> sign out -> sign in again" flow without window reload.
  // authClient = null;
};

