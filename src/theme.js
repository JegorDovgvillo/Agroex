import { createTheme } from '@mui/material/styles';
import varibles from '@scss/colorVariables.module.scss';

const {
  mainDark,
  mainBase,
  warningBase,
  monoGray,
  monoWhite,
  monoBlack,
  monoGrayDark50,
  grayLight1,
  grayLight2,
  errorBase,
  errorDark,
  errorLight,
  warningExtraLight,
  successBase,
  successLight,
  successDark,
  systemBase,
  systemExtraLight,
  systemDark,
} = varibles;

/* "warning" | "default" | "primary" | "secondary" | "error" | "info" | "success", */

export const customTheme = createTheme({
  palette: {
    common: {
      black: monoBlack,
      white: monoWhite,
    },

    primary: {
      main: mainDark,
      dark: mainBase,
      contrastText: monoWhite,
    },

    warning: {
      main: warningBase,
      light: warningExtraLight,
      contrastText: warningBase,
    },

    secondary: {
      main: systemDark,
    },

    grey: {
      monoGray: monoGray,
      monoGrayDark: monoGrayDark50,
      70: grayLight1,
      40: grayLight2,
    },

    error: {
      main: errorBase,
      dark: errorDark,
      light: errorLight,
      contrastText: errorBase,
    },

    success: {
      main: successBase,
      dark: successDark,
      light: successLight,
      contrastText: successBase,
    },

    info: {
      main: systemBase,
      dark: systemDark,
      light: systemExtraLight,
      contrastText: systemBase,
    },
  },

  typography: {
    fontFamily: ['IBM Plex Sans', 'sans-serif'].join(','),
  },
});
