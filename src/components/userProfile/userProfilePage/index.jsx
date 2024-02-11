import { useParams, Outlet } from 'react-router-dom';
import _ from 'lodash';

import userProfileData from '../userProfileData';

const UserProfilePage = () => {
  const { page, tab } = useParams();

  const pageElement = _.find(userProfileData, { route: page }).element;

  return (
    <>
      {!tab && pageElement}
      <Outlet />
    </>
  );
};

export default UserProfilePage;
