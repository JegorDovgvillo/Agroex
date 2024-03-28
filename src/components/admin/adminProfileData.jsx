import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import LayersIcon from '@mui/icons-material/Layers';
import AssessmentIcon from '@mui/icons-material/Assessment';

import CategoriesList from '@components/admin/adminCategories';
import AdminLotsList from '@components/admin/adminLotsList';
import UsersList from '@components/admin/usersList';
import AdminReports from '@components/admin/adminReports';

import { ADMIN_PAGES } from '@helpers/routeNames';

const { ADMIN_CATEGORIES, ADMIN_USERS, ADMIN_LOTS, ADMIN_REPORTS } =
  ADMIN_PAGES;

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
  {
    id: 3,
    name: 'Reports',
    icon: <AssessmentIcon />,
    route: ADMIN_REPORTS,
    element: <AdminReports />,
  },
];
