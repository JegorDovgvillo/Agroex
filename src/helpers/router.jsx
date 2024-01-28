import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LotList from '@pages/LotList';

import Layout from '@components/layout';
import { LotDetails } from '@pages/lot-details';

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
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
