const awsConfig = {
  Auth: {
    Cognito: {
      userPoolClientId: '5n4iencc2c5afpos8edngcgp3t',
      userPoolId: 'us-east-1_q32CiA5C2',
      loginWith: {
        // oauth: {
        //   domain: 'https://test-front.auth.us-east-1.amazoncognito.com',
        //   scopes: [
        //     'email',
        //     'openid',
        //     'profile',
        //     'aws.cognito.signin.user.admin',
        //   ],
        //   redirectSignIn: ['http://localhost:5173/lots', ''],
        //   redirectSignOut: ['http://localhost:5173/lots', ''],
        //   responseType: 'code',
        // },
        // username: 'false',

        // phone: 'false',
        email: 'true',
      },
    },
  },
};

export default awsConfig;
