import { useEffect, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import _ from 'lodash';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ROUTES from '@helpers/routeNames';
const { ADMIN_PAGE } = ROUTES;

import { adminProfileData } from '../adminProfileData';

export const MainListItems = () => {
  const navigate = useNavigate();
  const { page } = useParams();
  const [activePage, setActivePage] = useState(
    _.find(adminProfileData, { route: page }) || adminProfileData[0]
  );

  const handleClick = (page) => {
    setActivePage(page);
  };

  useEffect(() => {
    const path = generatePath(ADMIN_PAGE, {
      page: activePage.route,
    });

    navigate(path);
  }, [activePage, navigate]);

  return (
    <>
      {adminProfileData.map((el) => (
        <ListItemButton
          key={el.id}
          onClick={() => handleClick(el)}
          selected={activePage.id === el.id}
        >
          <ListItemIcon>{el.icon}</ListItemIcon>
          <ListItemText primary={el.name} />
        </ListItemButton>
      ))}
    </>
  );
};
