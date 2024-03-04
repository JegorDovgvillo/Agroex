import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import LayersIcon from '@mui/icons-material/Layers';

import CategoriesList from '@components/admin/adminCategories';
import AdminLotsList from '@components/admin/adminLotsList';
import UsersList from '@components/admin/usersList';

import { ADMIN_PAGES } from '@helpers/routeNames';

const { ADMIN_CATEGORIES, ADMIN_USERS, ADMIN_LOTS } = ADMIN_PAGES;

export const adminProfileData = [
  {
    id: 0,
    name: 'Categories',
    icon: <LayersIcon />,
    route: ADMIN_CATEGORIES,
    element: <CategoriesList />,
  },
  {
    id: 1,
    name: 'Users',
    icon: <PeopleIcon />,
    route: ADMIN_USERS,
    element: <UsersList />,
  },
  {
    id: 2,
    name: 'Lots',
    icon: <ShoppingCartIcon />,
    route: ADMIN_LOTS,
    element: <AdminLotsList />,
  },
];
