import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Filters from '@components/filters';
import ItemCard from '@components/itemCard';

import { fetchCategories } from '@thunks/fetchCategories';
import { fetchCountries } from '@thunks/fetchCountries';
import { filteredLots } from '@thunks/fetchLots';
import { fetchUsers } from '@thunks/fetchUsers';

import { usersListSelector } from '@slices/usersListSlice';
import { categoriesSelector } from '@slices/categoriesSlice';
import { countrySelector } from '@slices/countriesSlice';
import { lotListSelector } from '@slices/lotListSlice';

import styles from './lotList.module.scss';

const LotList = () => {
  const dispatch = useDispatch();
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

  return (
    <>
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
    </>
  );
};

export default LotList;
