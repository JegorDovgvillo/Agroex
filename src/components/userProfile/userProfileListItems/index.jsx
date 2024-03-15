import { useEffect, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import _ from 'lodash';

import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import ROUTES from '@helpers/routeNames';

import userProfileData from '../userProfileData';

import styles from './userProfileListItems.module.scss';

const { text, icon, iconActive, button, buttonActive, listItemsContainer } =
  styles;

const { USER_PROFILE_PAGE_TAB } = ROUTES;

const UserProfileListItems = () => {
  const navigate = useNavigate();
  const { page, tab } = useParams();

  const [activePage, setActivePage] = useState(
    _.find(userProfileData, { route: page }) || userProfileData[0]
  );

  useEffect(() => {
    page &&
      setActivePage(
        _.find(userProfileData, { route: page }) || userProfileData[0]
      );
  }, [page, tab]);

  const handleClick = (page) => {
    setActivePage(page);

    const path = generatePath(USER_PROFILE_PAGE_TAB, {
      page: page.route,
      tab: page.tabs?.[0].tabRoute || '',
    });

    navigate(path);
  };

  return (
    <div className={listItemsContainer}>
      {userProfileData.map((el) => (
        <ListItemButton
          key={el.id}
          onClick={() => handleClick(el)}
          selected={activePage.id === el.id}
          className={`${button} ${activePage.id === el.id && buttonActive}`}
        >
          <ListItemIcon
            className={`${icon} ${activePage.id === el.id && iconActive}`}
          >
            {el.icon}
          </ListItemIcon>
          <ListItemText primary={el.name} className={text} disableTypography />
        </ListItemButton>
      ))}
    </div>
  );
};

export default UserProfileListItems;
