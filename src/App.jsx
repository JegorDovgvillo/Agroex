import Router from "./helpers/router";
import { ThemeProvider } from "@mui/material/styles";
import { customTheme } from "./theme";
import { Provider } from "react-redux";
import store from "./store/store";
function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <Provider store={store}>
        <Router />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
