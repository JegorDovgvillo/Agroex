import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LotList from '@pages/LotList';
import AdminPage from '@pages/Admin';
import { LotDetails } from '@pages/LotDetails';
import CreateNewLot from '@pages/createNewLot';
import UpdateLot from '@pages/updateLot';

import UsersList from '@components/admin/usersList';
import Layout from '@components/layout';
import CategoriesList from '@components/admin/adminCategories';
import AdminLotsList from '@components/admin/adminLotsList';

import ROUTES from './routeNames';

const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: ROUTES.LOTS,
          element: <LotList />,
        },
        {
          path: ROUTES.LOTS_BUY,
          element: <LotList lotType={'buy'} />,
        },
        {
          path: ROUTES.LOTS_SELL,
          element: <LotList lotType={'sell'} />,
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
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
