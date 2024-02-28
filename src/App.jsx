import { Amplify } from 'aws-amplify';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { CookieStorage } from 'aws-amplify/utils';

import Router from '@helpers/router';
import store from '@store/store';

import { customTheme } from './theme';
import awsConfigUsers from './helpers/cognito/aws-config-users';

function App() {
  cognitoUserPoolsTokenProvider.setKeyValueStorage(
    new CookieStorage({ expires: 10, path: '/' })
  );

  Amplify.configure(awsConfigUsers);

  return (
    <ThemeProvider theme={customTheme}>
      <Provider store={store}>
        <Router />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
