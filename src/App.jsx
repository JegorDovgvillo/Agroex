import { Amplify } from 'aws-amplify';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { CookieStorage } from 'aws-amplify/utils';

import Router from '@helpers/router';
import awsConfigUsers from '@helpers/cognito/aws-config-users';

import store from '@store/store';

import { customTheme } from './theme';

function App() {
  cognitoUserPoolsTokenProvider.setKeyValueStorage(
    new CookieStorage({ path: '/', secure: true, sameSite: 'strict' })
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
