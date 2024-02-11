import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { CssBaseline, Toolbar } from '@mui/material';

import { MainListItems } from '@components/admin/adminListItems';
import CustomAppBar from '@components/customAppBar';
import CustomDrawer from '@components/customDrawer';

import styles from './admin.module.scss';

const AdminPage = () => {
  const [isOpen, setOpen] = useState(window.innerWidth > 1200);
  const [isBarVisible, setIsBarVisible] = useState(window.innerWidth > 1000);

  const toggleDrawer = () => {
    setOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth > 1200);
      setIsBarVisible(window.innerWidth > 1200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.appBarContainer}>
        <CssBaseline />
        <div className={styles.aBar1}>
          <CustomAppBar {...{ isOpen, toggleDrawer, isBarVisible }} />
        </div>
        <CustomDrawer {...{ isOpen, toggleDrawer, isBarVisible }}>
          <MainListItems />
        </CustomDrawer>
        <div className={styles.contentContainer}>
          <Toolbar />
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
