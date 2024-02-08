import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import { USER_PROFILE_PAGE_ROTES } from '@helpers/routeNames';

import UserAdverts from './pages/userAdverts';
import Betting from './pages/betting';
import UserAccount from './pages/userAccount';

const { USER_ADVERTS, USER_BETTING, USER_ORDERS, USER_ACCOUNT } =
  USER_PROFILE_PAGE_ROTES;

const userProfileData = [
  {
    id: 0,
    name: 'My advertisements',
    icon: <GrassOutlinedIcon />,
    route: USER_ADVERTS,
    tabs: [
      { id: 0, tabRoute: 'active' },
      { id: 1, tabRoute: 'pending' },
      { id: 2, tabRoute: 'inactive' },
    ],
    element: <UserAdverts />,
  },
  {
    id: 1,
    name: 'Betting',
    icon: <GavelOutlinedIcon />,
    route: USER_BETTING,
    tabs: [
      { id: 0, tabRoute: 'active' },
      { id: 1, tabRoute: 'outbid' },
    ],
    element: <Betting />,
  },
  {
    id: 2,
    name: 'My orders',
    icon: <LocalShippingOutlinedIcon />,
    route: USER_ORDERS,
    tabs: [
      { id: 0, tabRoute: 'active' },
      { id: 1, tabRoute: 'completed' },
    ],
    element: '<UserOrders />',
  },
  {
    id: 3,
    name: 'My account',
    icon: <AccountCircleOutlinedIcon />,
    route: USER_ACCOUNT,
    element: <UserAccount />,
  },
];

export default userProfileData;
