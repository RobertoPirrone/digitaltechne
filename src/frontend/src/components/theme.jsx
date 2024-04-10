import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
    palette: {
      primary: {
        main: '#E1E002',
        contrastText: '#000000',
      },
      // secondary : usare button variant="outlined" 
      // per fare button con colore di sfondo, usare variant="contained", main: colore sfondo, contrastText: colore scritta
      secondary: {
        main: '#777700'
      },
      /*
      background: {
        default: '#999999',
      },
      */
    },
  });

