import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ROUTES from './routeNames';
import Layout from '../components/layout';

const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: ROUTES.LOTS,
          element: 'Lots',
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
