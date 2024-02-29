import { Authenticator } from '@aws-amplify/ui-react';
import { TextField, Autocomplete } from '@mui/material';

import '@aws-amplify/ui-react/styles.css';
import './loginForm.scss';

const formFields = {
  signUp: {
    email: {
      order: 1,
    },
    name: {
      order: 2,
    },
    password: {
      order: 3,
    },
    confirm_password: {
      order: 4,
    },
  },
};

const LoginForm = ({ filteredTimeZone, timeZones }) => {
  return (
    <div className="wrapp">
      <Authenticator
        formFields={formFields}
        signUpAttributes={['email', 'name']}
        components={{
          SignUp: {
            FormFields() {
              return (
                <>
                  <Authenticator.SignUp.FormFields />
                  <Autocomplete
                    disablePortal
                    defaultValue={filteredTimeZone[0]}
                    options={timeZones}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <label>
                        Time Zones
                        <TextField {...params} name="zoneinfo" />
                      </label>
                    )}
                  />
                </>
              );
            },
          },
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
        }}
        //will be realized later  socialProviders={['google']}
      />
    </div>
  );
};

export default LoginForm;
