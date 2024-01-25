import Router from './helpers/router';
import { ThemeProvider } from '@mui/material/styles';
import { customTheme } from './theme';

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <Router />
    </ThemeProvider>
  );
}

export default App;
