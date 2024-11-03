import { blue, green, red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const themeCommon = createTheme();

themeCommon.typography.h3 = {
  fontSize: '1.2rem',
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  [themeCommon.breakpoints.up('md')]: {
    fontSize: '2.4rem',
  },
};


themeCommon.components = {
    MuiButton: {
      defaultProps: {
        color: "secondary",
        background: "green"
      },
      styleOverrides: {
        root: {
          padding: ".5rem 1.5rem"
        }
      }
    }
  };
