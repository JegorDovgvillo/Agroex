import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import LayersIcon from '@mui/icons-material/Layers';

import ROUTES from '@helpers/routeNames';

const { ADMIN_CATEGORIES, ADMIN_USERS, ADMIN_LOTS } = ROUTES;

const adminListItems = [
  { id: 1, name: 'Categories', icon: <LayersIcon />, route: ADMIN_CATEGORIES },
  { id: 2, name: 'Users', icon: <PeopleIcon />, route: ADMIN_USERS },
  { id: 3, name: 'Lots', icon: <ShoppingCartIcon />, route: ADMIN_LOTS },
];

export const MainListItems = () => {
  const navigate = useNavigate();
  const [activeItemId, setActiveItemId] = useState(1);

  useEffect(() => {
    const activeItemRoute = adminListItems.find(
      (el) => el.id === activeItemId
    ).route;
    navigate(activeItemRoute);
  }, [activeItemId, navigate]);

  const handleClick = (id, route) => {
    setActiveItemId(id);
    navigate(route);
  };

  return (
    <>
      {adminListItems.map((el) => (
        <ListItemButton
          key={el.id}
          onClick={() => handleClick(el.id, el.route)}
          selected={activeItemId === el.id && true}
        >
          <ListItemIcon>{el.icon}</ListItemIcon>
          <ListItemText primary={el.name} />
        </ListItemButton>
      ))}
    </>
  );
};
