import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import Filters from '@components/filters';
import ItemCard from '@components/itemCard';

import { fetchLots } from '@thunks/fetchLots';
import { lotListSelector } from '@slices/lotListSlice';

import styles from './lotList.module.scss';
import { categoriesSelector } from '../../store/slices/categoriesSlice';
import { fetchCategories } from '../../store/thunks/fetchCategories';
import { countrySelector } from '../../store/slices/countriesSlice';
import { fetchCountries } from '../../store/thunks/fetchCountries';
const LotList = () => {
  const dispatch = useDispatch();
  const lots = useSelector(lotListSelector);
  const categories = useSelector(categoriesSelector);
  const countries = useSelector(countrySelector);
  useEffect(() => {
    dispatch(fetchLots());
    dispatch(fetchCategories());
    dispatch(fetchCountries());
  }, [dispatch]);

  const renderLots = () => {
    const filteredLots = lots.map((item) => {
      return <ItemCard {...item} key={item.id} />;
    });

    return <>{filteredLots}</>;
  };

  const allLots = renderLots();

  return (
    <>
      <Filters categories={categories} countries={countries} />
      <div className={styles.lotListWrapp}>{allLots}</div>
    </>
  );
};

export default LotList;
