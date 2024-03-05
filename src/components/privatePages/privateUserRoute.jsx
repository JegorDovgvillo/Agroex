import { Navigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

import ROUTES from '@helpers/routeNames';

import ErrorModal from '@customModals/errorModal';

const PrivateUserRoute = ({ Component }) => {
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

  if (!token) {
    return <Navigate to={ROUTES.LOG_IN} />;
  } else if (token && token.payload['custom:role'] === 'admin') {
    return (
      <ErrorModal title="Access error" text="You can not access this page" />
    );
  }

  return <Component />;
};

export default PrivateUserRoute;
