import { useEffect } from 'react';
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

  const handleClick = (page) => {
    const path = generatePath(ADMIN_PAGE, {
      page: page.route,
    });

    navigate(path);
  };

  useEffect(() => {
    const currPage = _.find(adminProfileData, { route: page });

    const path = generatePath(ADMIN_PAGE, {
      page: currPage.route,
    });

    navigate(path);
  }, [page]);

  return (
    <>
      {adminProfileData.map((el) => (
        <ListItemButton
          key={el.id}
          onClick={() => handleClick(el)}
          selected={page === _.toLower(el.name)}
        >
          <ListItemIcon>{el.icon}</ListItemIcon>
          <ListItemText primary={el.name} />
        </ListItemButton>
      ))}
    </>
  );
};
