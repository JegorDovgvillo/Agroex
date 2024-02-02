import { NavLink } from 'react-router-dom';

import AgroexLogo from '@assets/icons/AgroexLogoHeader.svg';
import styles from './header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <NavLink to="/">
        <div className={styles.logo}>
          <img src={AgroexLogo} alt="Agroex Logo" />
        </div>
      </NavLink>
    </header>
  );
};

export default Header;
