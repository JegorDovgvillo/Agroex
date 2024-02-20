import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import _ from 'lodash';

import Filters from '@components/filters';
import ItemCard from '@components/itemCard';
import CustomBreadcrumbs from '@components/customBreadcrumbs';

import { fetchAllCategories } from '@thunks/fetchCategories';
import { fetchCountries } from '@thunks/fetchCountries';
import { filteredLots } from '@thunks/fetchLots';
import { fetchUsers } from '@thunks/fetchUsers';

import { usersListSelector } from '@slices/usersListSlice';
import {
  categoriesSelector,
  selectSubcategories,
} from '@slices/categoriesSlice';
import { countrySelector } from '@slices/countriesSlice';
import { lotListSelector } from '@slices/lotListSlice';

import styles from './lotList.module.scss';

const LotList = () => {
  const dispatch = useDispatch();
  const { subcategory } = useParams();
  const lots = useSelector(lotListSelector);
  const categories = useSelector(categoriesSelector);
  const subcategories = useSelector(selectSubcategories);
  const countries = useSelector(countrySelector);
  const users = useSelector(usersListSelector);

  const subcategoryId =
    subcategory &&
    _.find(categories, (cat) => _.toLower(cat.title) === subcategory)?.id;

  const subcategorySearchParams = subcategoryId && [
    ['categories', [subcategoryId]],
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (subcategory) {
      setSearchParams(subcategorySearchParams);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchCountries());
    dispatch(fetchUsers());

    dispatch(filteredLots(searchParams));
  }, [dispatch, searchParams]);

  return (
    <div className={styles.lotListContainer}>
      <div className={styles.breadCrumbsContainer}>
        <CustomBreadcrumbs />
        {subcategory && <h4 className={styles.title}>{subcategory}</h4>}
      </div>
      <div className={styles.contentContainer}>
        <Filters
          categories={subcategories}
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
