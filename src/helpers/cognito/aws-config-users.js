const USER_POOL_ID = import.meta.env.VITE_BASE_USER_POOL_ID;
const USER_POOL_CLIENT_ID = import.meta.env.VITE_BASE_USER_POOL_CLIENT_ID;

const awsConfigUsers = {
  Auth: {
    Cognito: {
      userPoolClientId: USER_POOL_CLIENT_ID,
      userPoolId: USER_POOL_ID,
      loginWith: {
        email: 'true',
      },
    },
  },
};

export default awsConfigUsers;
