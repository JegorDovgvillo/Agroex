import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { MainListItems } from '@components/admin/adminListItems';
import { AppBar } from '@components/admin/appBar';
import { Drawer } from '@components/admin/drawer';

import styles from './admin.module.scss';

const AdminPage = () => {
  const [open, setOpen] = useState(window.innerWidth > 1200);
  const [isBarVisible, setIsBarVisible] = useState(window.innerWidth > 1000);

  const toggleDrawer = () => {
    setOpen(!open);
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
    <div className={styles.userPageContainer}>
      <div className={styles.appBarContainer}>
        <CssBaseline />
        <AppBar open={open} className={styles.appBar}>
          <Toolbar className={styles.toolBarHeader}>
            <IconButton
              className={`${styles.toolBarBtn} ${open && styles.hidden}`}
              edge="start"
              aria-label="open drawer"
              onClick={toggleDrawer}
            >
              {isBarVisible && <MenuIcon />}
            </IconButton>
            <h6 className={styles.toolBarTitle}>Dashboard</h6>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open} className={styles.toolBar}>
          <Toolbar className={styles.toolBarRightHeader}>
            {isBarVisible && (
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            )}
          </Toolbar>
          <Divider />
          <List component="nav">
            <MainListItems />
          </List>
        </Drawer>
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
