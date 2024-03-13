import { NavLink } from 'react-router-dom';
import AgroexLogo from '@icons/AgroexLogoHeader.svg';

import Search from '../search';
import UserIconInHeader from '../userIconInHeader';

import styles from './header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.link}>
        <div>
          <img src={AgroexLogo} alt="Agroex Logo" />
        </div>
      </NavLink>
      <Search />
      <UserIconInHeader />
    </header>
  );
};

export default Header;
