import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import Router from '@helpers/router';
import store from '@store/store';
import { customTheme } from './theme';

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
