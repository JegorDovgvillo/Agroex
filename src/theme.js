import { createTheme } from "@mui/material/styles";
import varibles from "./sass/colorVariables.module.scss";

const {
  mainDark,
  mainBase,
  warningBase,
  monoGray,
  monoWhite,
  monoBlack,
  systemDark,
  monoGrayDark50,
  grayLight1,
  grayLight2,
  errorBase,
  errorDark,
  errorLight,
} = varibles;

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
      contrastText: monoBlack,
    },
  },
});
