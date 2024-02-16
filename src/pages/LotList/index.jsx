import { useDispatch, useSelector } from 'react-redux';
import { useParams, generatePath } from 'react-router-dom';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import _ from 'lodash';

import Filters from '@components/filters';
import ItemCard from '@components/itemCard';
import CustomBreadcrumbs from '@components/customBreadcrumbs';

import { fetchCategories } from '@thunks/fetchCategories';
import { fetchCountries } from '@thunks/fetchCountries';
import { filteredLots } from '@thunks/fetchLots';
import { fetchUsers } from '@thunks/fetchUsers';

import { usersListSelector } from '@slices/usersListSlice';
import { categoriesSelector } from '@slices/categoriesSlice';
import { countrySelector } from '@slices/countriesSlice';
import { lotListSelector } from '@slices/lotListSlice';
import ROUTES from '@helpers/routeNames';

import styles from './lotList.module.scss';

const { CATEGORY_PAGE } = ROUTES;

const LotList = ({ lotType }) => {
  const dispatch = useDispatch();
  const { category, subcategory } = useParams();
  const lots = useSelector(lotListSelector);
  const categories = useSelector(categoriesSelector);
  const countries = useSelector(countrySelector);
  const users = useSelector(usersListSelector);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchCountries());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filteredLots(searchParams));
  }, [searchParams]);

  const breadCrumbsProps = [
    { id: 1, link: '/', value: 'Categories' },
    {
      id: 2,
      link: generatePath(CATEGORY_PAGE, {
        category: category,
      }),
      value: _.capitalize(category),
    },
    { id: 3, link: null, value: _.capitalize(subcategory) },
  ];

  return (
    <div className={styles.lotListContainer}>
      <div className={styles.breadCrumbsContainer}>
        <CustomBreadcrumbs props={breadCrumbsProps} />
        {subcategory && (
          <h4 className={styles.title}>{_.capitalize(subcategory)}</h4>
        )}
      </div>
      <div className={styles.contentContainer}>
        <Filters
          categories={categories}
          countries={countries}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          users={users}
        />
        <div className={styles.lotListWrapp}>
          {lots.map((item) => (
            <ItemCard {...item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LotList;
