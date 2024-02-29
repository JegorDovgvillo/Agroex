import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react';
import '../loginForm/loginForm.scss';

const AuthenticatedPage = ({ Component }) => {
  const AuthenticatedComponent = withAuthenticator(Component, {
    hideSignUp: true,
    components: {
      ForceNewPassword: {
        FormFields() {
          return (
            <>
              <input
                type="text"
                hidden
                autoComplete="username"
                name="username"
              />
              <Authenticator.ForceNewPassword.FormFields />
            </>
          );
        },
      },
    },
  });

  return <AuthenticatedComponent />;
};

export default AuthenticatedPage;
