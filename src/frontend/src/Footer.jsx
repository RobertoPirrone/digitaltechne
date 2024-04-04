import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import {DTGrow, DTFooter} from "./components/useStyles";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {'Copyright © '}
      <Link color="inherit" href="https://www.digitaltechne.it" target="_blank" rel="noopener" >
        https://digitaltechne.it
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

export const Footer = () => {

  return (
   <div>
    <div className="UnderFooter" />
    <div className={DTFooter}>
      <footer className={DTFooter}>
        <Container maxWidth="sm">
          {/* <Typography variant="body1">Roma, 2020</Typography>*/}
          <Copyright />
        </Container>
      </footer>
    </div>
   </div>
  );
}

