import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, generatePath } from 'react-router-dom';
import { isEmpty, toLower } from 'lodash';
import AgroexLogo from '@icons/AgroexLogoHeader.svg';

import { fetchAllCategories } from '@thunks/fetchCategories';
import { selectRootCategories } from '@slices/categoriesSlice';
import { AddNewLotButton } from '@components/addNewLotButton';
import { CurrencySelect } from '@components/currencySelect';
import ROUTES from '@helpers/routeNames';
import Search from '../search';
import UserIconInHeader from '../userIconInHeader';
import Notifications from '../notifications';

const { HOME_PAGE } = ROUTES;

import styles from './header.module.scss';

const Header = () => {
  const dispatch = useDispatch();
  const [homePagePath, setHomePagePath] = useState(null);
  const categories = useSelector(selectRootCategories);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isEmpty(categories)) return;

    const defaultCategory = toLower(categories[0].title);
    const path = generatePath(HOME_PAGE, { category: defaultCategory });

    setHomePagePath(path);
  }, [categories]);

  return (
    <header className={styles.header}>
      <div className={styles.wrapp}>
        <NavLink to={homePagePath} className={styles.link}>
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
