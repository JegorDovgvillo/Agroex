import { NavLink } from 'react-router-dom';
import { signOut } from '@aws-amplify/auth';
import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import userProfileData from '../userProfile/userProfileData';

import { getUserFromCognito } from '@thunks/fetchUsers';

import styles from './userIconInHeader.module.scss';

const UserIconInHeader = () => {
  const dispatch = useDispatch();

  const [isActive, setIsActive] = useState(false);
  const [userIcon, setUserIcon] = useState(null);

  const userInfo = useSelector((state) => state.usersList.userInfo);

  useEffect(() => {
    dispatch(getUserFromCognito());
  }, []);

  const showLinks = () => {
    setIsActive((isActive) => !isActive);
  };

  useEffect(() => {
    if (userInfo) {
      createUserIcon();
    }
  }, [userInfo]);

  const createUserIcon = () => {
    const initials = userInfo.name
      .split(' ')
      .map((el) => el.slice(0, 1))
      .join('')
      .toUpperCase();
    setUserIcon(initials);
  };

  const linkStyle = isActive ? styles.active : styles.enabled;

  return (
    <div className={styles.container}>
      <div onClick={showLinks}>
        <Avatar className={styles.avatar}>{userIcon}</Avatar>
      </div>
      <ul className={`${styles.linkContainer} ${linkStyle}`}>
        <li className={styles.linkWrapp}>{userInfo && userInfo.name}</li>
        {userProfileData.map((item) => {
          return (
            <li key={item.id} className={styles.linkWrapp}>
              <item.icon.type className={styles.icon} />
              <NavLink
                to={`/user-profile/${item.route}`}
                className={styles.link}
              >
                {item.name}
              </NavLink>
            </li>
          );
        })}
        <li onClick={signOut} className={styles.linkWrapp}>
          Sign Out
        </li>
      </ul>
    </div>
  );
};

export default UserIconInHeader;
