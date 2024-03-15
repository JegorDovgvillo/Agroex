import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LotList from '@pages/LotList';
import AdminPage from '@pages/Admin';
import { LotDetails } from '@pages/LotDetails';
import CreateNewLot from '@pages/createNewLot';
import UpdateLot from '@pages/updateLot';
import UserProfile from '@pages/UserProfile';
import HomePage from '@pages/HomePage';
import Login from '@pages/login';

import Layout from '@components/layout';
import UserProfilePage from '@components/userProfile/userProfilePage';
import UserProfileTabPanel from '@components/customTabPanels/userProfileTabPanel';
import PrivateUserRoute from '@components/privatePages/privateUserRoute';
import PrivateAdminRoute from '@components/privatePages/privateAdminRoute';
import AdminTabContent from '@components/admin/adminTabContent';

import ROUTES from './routeNames';

const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: ROUTES.HOME_PAGE,
          element: <HomePage />,
        },
        {
          path: ROUTES.LOTS,
          element: <LotList />,
        },
        {
          path: ROUTES.LOG_IN,
          element: <Login />,
        },
        {
          path: ROUTES.LOTS_DETAILS,
          element: <LotDetails />,
        },
        {
          path: ROUTES.CREATE_NEW_LOT,
          element: <PrivateUserRoute Component={CreateNewLot} />,
        },
        {
          path: ROUTES.UPDATE_LOT,
          element: <PrivateUserRoute Component={UpdateLot} />,
        },
        {
          path: ROUTES.ADMIN,
          element: <PrivateAdminRoute Component={AdminPage} />,
          children: [
            {
              path: ROUTES.ADMIN_PAGE,
              element: <AdminTabContent />,
            },
          ],
        },
        {
          path: ROUTES.USER_PROFILE,
          element: <PrivateUserRoute Component={UserProfile} />,
          children: [
            {
              path: ROUTES.USER_PROFILE_PAGE,
              element: <UserProfilePage />,
              children: [
                {
                  path: ROUTES.USER_PROFILE_PAGE_TAB,
                  element: <UserProfileTabPanel />,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
