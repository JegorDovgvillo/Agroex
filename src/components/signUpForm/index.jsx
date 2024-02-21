import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
// import { Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';

import awsConfig from '@helpers/aws-config';
import timeZones from '../../data/timeZones';

import './signUpForm.scss';

Amplify.configure(awsConfig);

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

const SignUpForm = () => {
  const filteredTimeZone = timeZones.filter(
    (zone) => zone.value === 'Europe/London'
  );

  // const services = {
  //   async handleSignUp() {
  //     return Auth.signUp({});
  //   },
  // };

  return (
    <div className="wrapp">
      <Authenticator
        // services={services}
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
        // socialProviders={['google']}
      >
        {({ signOut, user }) => (
          <div>
            <p>Welcome {user.username}</p>
            <button onClick={signOut}>Sign out</button>
          </div>
        )}
      </Authenticator>
    </div>
  );
};

export default SignUpForm;
