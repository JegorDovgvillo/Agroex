import { useParams, Outlet } from 'react-router-dom';

import userProfileData from '../userProfileData';

const UserProfilePage = () => {
  const { page, tab } = useParams();
  const pageElement = userProfileData.find((p) => p.route === page).element;

  return (
    <>
      {!tab && pageElement}
      <Outlet />
    </>
  );
};

export default UserProfilePage;
