import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LotList from '@pages/LotList';
import AdminPage from '@pages/Admin';
import { LotDetails } from '@pages/LotDetails';
import CreateNewLot from '@pages/createNewLot';
import UpdateLot from '@pages/updateLot';
import UserProfile from '@pages/UserProfile';
import HomePage from '@pages/HomePage';

import UsersList from '@components/admin/usersList';
import Layout from '@components/layout';
import CategoriesList from '@components/admin/adminCategories';
import AdminLotsList from '@components/admin/adminLotsList';
import UserProfilePage from '@components/userProfile/userProfilePage';
import UserProfileTabPanel from '@components/customTabPanels/userProfileTabPanel';

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
          path: ROUTES.SIGN_UP_PAGE,
          element: <SignUp />,
        },
        {
          path: ROUTES.LOTS_DETAILS,
          element: <LotDetails />,
        },
        {
          path: ROUTES.CREATE_NEW_LOT,
          element: <CreateNewLot />,
        },
        {
          path: ROUTES.UPDATE_LOT,
          element: <UpdateLot />,
        },
        {
          path: ROUTES.ADMIN,
          element: <AdminPage />,
          children: [
            {
              path: ROUTES.ADMIN_CATEGORIES,
              element: <CategoriesList />,
            },
            {
              path: ROUTES.ADMIN_USERS,
              element: <UsersList />,
            },
            {
              path: ROUTES.ADMIN_LOTS,
              element: <AdminLotsList />,
            },
          ],
        },
        {
          path: ROUTES.USER_PROFILE,
          element: <UserProfile />,
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
