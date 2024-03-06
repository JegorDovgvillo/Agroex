import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
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
import { categoriesSelector } from '@slices/categoriesSlice';
import { countrySelector } from '@slices/countriesSlice';
import { lotListSelector, clearLots } from '@slices/lotListSlice';

import styles from './lotList.module.scss';

const LotList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const lots = useSelector(lotListSelector);
  const categories = useSelector(categoriesSelector);

  const countries = useSelector(countrySelector);
  const users = useSelector(usersListSelector);

  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState([]);
  const [selectedSubcategoriesIds, setSelectedSubcategoriesIds] = useState([]);

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchCountries({ existet: true }));
    dispatch(fetchUsers());

    return () => {
      dispatch(clearLots());
    };
  }, []);

  useEffect(() => {
    dispatch(filteredLots(searchParams));
  }, [searchParams]);

  useEffect(() => {
    const searchParamsCategoryIds = searchParams.get('categories');

    if (categories.length > 0 && searchParamsCategoryIds) {
      const selectedCategories = _.split(searchParamsCategoryIds, ',').map(
        (id) => _.find(categories, { id: _.toNumber(id) })
      );
      const selectedSubcategoriesIds = _.map(selectedCategories, 'id');
      const parentIds = _.uniqBy(_.map(selectedCategories, 'parentId'));

      setSelectedCategoriesIds(parentIds);
      setSelectedSubcategoriesIds(selectedSubcategoriesIds);
    }
  }, [categories, searchParams]);

  return (
    <div className={styles.lotListContainer}>
      <div className={styles.breadCrumbsContainer}>
        <CustomBreadcrumbs
          categories={categories}
          setSearchParams={setSearchParams}
          setSelectedCategoriesIds={setSelectedCategoriesIds}
          setSelectedSubcategoriesIds={setSelectedSubcategoriesIds}
        />
      </div>
      <div className={styles.contentContainer}>
        <Filters
          categories={categories}
          countries={countries}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          users={users}
          selectedCategoriesIds={selectedCategoriesIds}
          setSelectedCategoriesIds={setSelectedCategoriesIds}
          selectedSubcategoriesIds={selectedSubcategoriesIds}
          setSelectedSubcategoriesIds={setSelectedSubcategoriesIds}
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
