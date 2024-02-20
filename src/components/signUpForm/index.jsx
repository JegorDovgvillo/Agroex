import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router';
import awsConfig from '@helpers/aws-config';

import '@aws-amplify/ui-react/styles.css';
import styles from './signUpForm.module.scss';

Amplify.configure(awsConfig);

const SignUpForm = () => {
  const navigate = useNavigate();
  const navigateToUserProfile = () => {
    navigate('/lots');
  };
  return (
    <div className={styles.wrapp}>
      <Authenticator
        signUpAttributes={['email', 'name']}
        // socialProviders={['google']}
      >
        {({ signOut, user }) => (
          <div>
            <p>Welcome {user.username}</p>
            <button onClick={navigateToUserProfile}>Sign out</button>
          </div>
        )}
      </Authenticator>
    </div>
  );
};

export default SignUpForm;
