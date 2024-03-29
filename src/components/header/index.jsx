import { NavLink } from 'react-router-dom';
import AgroexLogo from '@icons/AgroexLogoHeader.svg';

import { AddNewLotButton } from '@components/addNewLotButton';
import { CurrencySelect } from '@components/currencySelect';
import Search from '../search';
import UserIconInHeader from '../userIconInHeader';
import Notifications from '../notifications';

import styles from './header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.wrapp}>
        <NavLink to="/" className={styles.link}>
          <div>
            <img src={AgroexLogo} alt="Agroex Logo" />
          </div>
        </NavLink>
        <Search />
        <CurrencySelect />
        <AddNewLotButton />
        <Notifications />
        <UserIconInHeader />
      </div>
    </header>
  );
};

export default Header;
