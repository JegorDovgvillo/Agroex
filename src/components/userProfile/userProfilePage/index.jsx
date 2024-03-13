import { useEffect } from 'react';
import { useNavigate, generatePath, useParams, Outlet } from 'react-router-dom';
import _ from 'lodash';

import ROUTES from '@helpers/routeNames';
import userProfileData from '../userProfileData';

const { USER_PROFILE_PAGE_TAB } = ROUTES;

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { page, tab } = useParams();

  const userProfileDataItem = _.find(userProfileData, { route: page });

  useEffect(() => {
    if (!userProfileDataItem.tabs) return;

    if (!_.isEmpty(userProfileDataItem.tabs)) {
      const path = generatePath(USER_PROFILE_PAGE_TAB, {
        page: page,
        tab: userProfileDataItem.tabs[0].tabRoute,
      });

      navigate(path);
    }
  }, [page]);

  return (
    <>
      {!tab && !userProfileDataItem.tabs && userProfileDataItem.element}
      <Outlet />
    </>
  );
};

export default UserProfilePage;
