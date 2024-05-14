import React from "react";
import { useTranslation, Trans } from 'react-i18next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useAuth } from "./use-auth-client";
import { DTPaper } from '../components/useStyles';
import { MostSubmitButton } from '../components/MostComponents';
import logo from '/DT-noalpha.png';

function LoggedOut() {
  const { login } = useAuth();
  const { t, i18n } = useTranslation();
  const infoUrl = "/html/MISC/first_info.html";

  return (
    <Container component="main" maxWidth="xs">
      <div className={DTPaper}>
        <img src={logo} width={400} className="XXXApp-logo" alt="logo" />
        <Typography component="h1" variant="h5"> <Trans i18nKey="techneTitle" /> </Typography>
        <div className="w-1/2 mb-4"> 
          <MostSubmitButton onClick={login} className="makeStyles-submit-4" label={t('SignIn.Sign In')}/>
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
  );
}

export default LoggedOut;
