import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CssBaseline, Toolbar } from '@mui/material';

import UserProfileListItems from '@components/userProfile/userProfileListItems';
import CustomAppBar from '@components/customAppBar';
import CustomDrawer from '@components/customDrawer';

import styles from './userProfile.module.scss';

const { pageContainer, appBarContainer, contentContainer, content } = styles;

const UserProfile = () => {
  const user = useSelector((state) => state.usersList.userInfo);
  const [isOpen, setIsOpen] = useState(window.innerWidth > 1200);
  const [isBarVisible, setIsBarVisible] = useState(window.innerWidth > 1000);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 1200);
      setIsBarVisible(window.innerWidth > 1200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={pageContainer}>
      <div className={appBarContainer}>
        <CssBaseline />
        <CustomAppBar {...{ isOpen, toggleDrawer, isBarVisible, user }} />
        <CustomDrawer {...{ isOpen, toggleDrawer, isBarVisible }}>
          <UserProfileListItems />
        </CustomDrawer>
        <div className={contentContainer}>
          <Toolbar />
          <div className={content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
