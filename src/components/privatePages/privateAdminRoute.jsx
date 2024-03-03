import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

import ErrorModal from '@customModals/errorModal';

const PrivateAdminRoute = ({ Component }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { idToken } = (await fetchAuthSession()).tokens ?? {};

    setToken(idToken);
  };

  if (token === null) {
    return <CircularProgress />;
  }
  console.log(token);
  if (!token || !token.payload['custom:role']) {
    return (
      <ErrorModal title="Access error" text="You can not access this page" />
    );
  }

  return <Component />;
};

export default PrivateAdminRoute;
