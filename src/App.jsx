import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';

import store from './store/store';
import Router from './helpers/router';

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
