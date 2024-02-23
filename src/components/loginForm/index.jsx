import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsConfigUsers from '@helpers/cognito/aws-config-users.js';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import './signUpForm.scss';

Amplify.configure(awsConfigUsers);

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

const LoginForm = ({ services, filteredTimeZone, timeZones }) => {
  return (
    <div className="wrapp">
      <Authenticator
        services={services}
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
                    defaultValue={
                      filteredTimeZone.length && filteredTimeZone[0]
                    }
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
        }}
        //will be realized later  socialProviders={['google']}
      />
    </div>
  );
};

export default LoginForm;
