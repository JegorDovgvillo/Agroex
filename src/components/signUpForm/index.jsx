import { signUp } from 'aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';
// import { useState } from 'react';
// import '@aws-amplify/ui-react/styles.css';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignUp({ username, password, email }) {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });

      console.log(userId);
    } catch (error) {
      console.log('error signing up:', error);
    }
  }

  return (
    <Authenticator
      initialState="signUp"
    />
  );
};

export default SignUpForm;
