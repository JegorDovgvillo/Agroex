import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ROUTES from './routeNames';
import Layout from '../components/layout';
import LotList from '../pages/LotList';

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
          element: <LotList lotType={'buy'}/>,
        },
        {
          path: ROUTES.LOTS_SELL,
          element: <LotList lotType={'sell'}/>,
        },
        {
          path: ROUTES.LOTS_DETAILS,
          element: 'Lots details',
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
