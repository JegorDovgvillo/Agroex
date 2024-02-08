import { useEffect, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

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
    userProfileData.find((p) => p.route === page) || userProfileData[0]
  );

  const [activeTab, setActiveTab] = useState(
    activePage.tabs?.find((t) => t.tabRoute === tab) ||
      activePage.tabs?.[0] ||
      null
  );

  useEffect(() => {
    const path = generatePath(USER_PROFILE_PAGE_TAB, {
      page: activePage.route,
      tab: activeTab?.tabRoute || '',
    });
    navigate(path);
  }, [activePage, activeTab, navigate]);

  const handleClick = (page) => {
    setActivePage(page);

    setActiveTab(page.tabs?.[0] || null);
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
