import { useState, useEffect } from 'react';
import { Outlet, useParams, useNavigate, generatePath } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toLower } from 'lodash';

import { CssBaseline, Toolbar } from '@mui/material';

import { getUserFromCognito } from '@thunks/fetchUsers';

import { MainListItems } from '@components/admin/adminListItems';
import CustomAppBar from '@components/customAppBar';
import CustomDrawer from '@components/customDrawer';
import { adminProfileData } from '@components/admin/adminProfileData';

import ROUTES from '@helpers/routeNames';

import styles from './admin.module.scss';

const { ADMIN_PAGE } = ROUTES;

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { page } = useParams();

  const [isOpen, setIsOpen] = useState(window.innerWidth > 1200);
  const [isBarVisible, setIsBarVisible] = useState(window.innerWidth > 1000);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    dispatch(getUserFromCognito());

    const handleResize = () => {
      setIsOpen(window.innerWidth > 1200);
      setIsBarVisible(window.innerWidth > 1200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (page) return;

    const currPage = toLower(adminProfileData[0].name);
    const path = generatePath(ADMIN_PAGE, {
      page: currPage,
    });

    navigate(path);
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
