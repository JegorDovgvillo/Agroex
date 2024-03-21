import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from '@aws-amplify/auth';
import { Avatar } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import _ from 'lodash';

import { lotListSelector } from '@slices/lotListSlice';
import { deleteUserInfo } from '@slices/usersListSlice';

import ROUTES from '@helpers/routeNames';

import userProfileData from '../userProfile/userProfileData';
import { adminProfileData } from '../admin/adminProfileData';

import styles from './userIconInHeader.module.scss';

const UserIconInHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userIconRef = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [userIcon, setUserIcon] = useState(null);
  const [links, setLinks] = useState(null);
  const [rootLink, setRootLink] = useState(null);

  const lots = useSelector(lotListSelector);
  const userInfo = useSelector((state) => state.usersList.userInfo);

  const filteredLotsByUserId = _.filter(lots, {
    userId: _.get(userInfo, 'sub'),
  });

  const filteredLotsByActiveTab = _.filter(filteredLotsByUserId, (item) => {
    return _.get(item, 'status') === 'active';
  });

  const createUserIcon = () => {
    const initials = userInfo.name
      .split(' ')
      .map((el) => el.slice(0, 1))
      .join('')
      .toUpperCase();

    setUserIcon(initials);
  };

  const toggleUserTabs = () => {
    setIsActive((isActive) => !isActive);
  };

  const renderLinks = () => {
    const links =
      userInfo['custom:role'] === 'admin' ? adminProfileData : userProfileData;
    const rootLink =
      userInfo['custom:role'] === 'admin' ? ROUTES.ADMIN : ROUTES.USER_PROFILE;

    setRootLink(rootLink);
    setLinks(links);
  };

  const handleSignOut = () => {
    signOut();
    dispatch(deleteUserInfo());
    setIsActive(false);
    navigate(ROUTES.LOG_IN);
  };

  const linkStyle = isActive ? styles.active : styles.enabled;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userIconRef.current && !userIconRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (userInfo) {
      createUserIcon();
      renderLinks();
    }
  }, [userInfo]);

  return (
    <>
      {userInfo && links ? (
        <div className={styles.container} ref={userIconRef}>
          <div onClick={toggleUserTabs}>
            <Avatar className={styles.avatar}>{userInfo && userIcon}</Avatar>
          </div>
          <ul className={`${styles.linkContainer} ${linkStyle}`}>
            <li className={styles.linkWrapp}>{userInfo && userInfo.name}</li>
            {links.map((item) => (
              <li
                key={item.id}
                className={styles.linkWrapp}
                onClick={toggleUserTabs}
              >
                <NavLink
                  to={`${rootLink}/${item.route}`}
                  className={styles.link}
                >
                  <item.icon.type className={styles.icon} />
                  {item.name}
                </NavLink>
                {item.name === 'My lots' ? (
                  <span className={styles.amount}>
                    {filteredLotsByActiveTab.length}
                  </span>
                ) : null}
              </li>
            ))}
            <li className={styles.linkWrapp} onClick={handleSignOut}>
              <span>
                <LogoutIcon sx={{ color: '#798787' }} />
                Sign Out
              </span>
            </li>
          </ul>
        </div>
      ) : (
        <NavLink to={ROUTES.LOG_IN} className={styles.loginLink}>
          Sign in
          <LoginIcon />
        </NavLink>
      )}
    </>
  );
};

export default UserIconInHeader;
