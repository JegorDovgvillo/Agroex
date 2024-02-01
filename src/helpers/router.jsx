import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LotList from '@pages/LotList';
import AdminPage from '@pages/Admin';
import { LotDetails } from '@pages/LotDetails';

import Layout from '@components/layout';
import { LotDetails } from '@pages/LotDetails';
import CreateNewAd from '@pages/createNewAd';

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
          path: ROUTES.ADMIN,
          element: <AdminPage />,
          children: [
            {
              path: ROUTES.ADMIN_CATEGORIES,
              element: 'AdminCategories',
            },
            {
              path: ROUTES.ADMIN_USERS,
              element: <UsersList />,
            },
            {
              path: ROUTES.ADMIN_LOTS,
              element: 'AdminLots',
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
