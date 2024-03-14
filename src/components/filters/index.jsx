import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';

import _ from 'lodash';

import { CustomButton } from '../buttons/CustomButton';
import CustomTextField from '../customTextField';
import CustomMultiSelect from '../customMultiSelect';
import { CloseButton } from '../buttons/CloseButton';
import CustomSelect from '../customSelect';

import styles from './filters.module.scss';

const Filters = ({
  categories,
  countries,
  searchParams,
  setSearchParams,
  users,
  selectedCategoriesIds,
  setSelectedCategoriesIds,
  selectedSubcategoriesIds,
  setSelectedSubcategoriesIds,
  selectedCountry,
  setSelectedCountry,
  setSelectedRegions,
  selectedRegions,
}) => {
  const getNumbersArray = (searchParams) => searchParams.split(',');

  const parentCategories = _.filter(categories, ['parentId', 0]);
  const currSubcategories = _.filter(categories, 'parentId');

  const [subcategoryUnits, setSubcategoryUnits] = useState(currSubcategories);
  const [regions, setRegions] = useState(selectedRegions);

  const initValues = {
    keyword: '',
    minQuantity: '',
    maxQuantity: '',
    minPrice: '',
    maxPrice: '',
    users: [],
    categories: [],
    subcategories: [],
    lotType: '',
    countries: [],
    regions: [],
  };

  const [initialValues, setInitialValues] = useState(initValues);

  const resetFilter = (resetForm) => {
    setSelectedCategoriesIds([]);
    setSelectedSubcategoriesIds([]);
    setSelectedCountry([]);
    setSelectedRegions([]);
    setSearchParams('');
    resetForm();
  };

  const applyFilters = (values) => {
    const isSubcategorySelected = values.subcategories.length > 0;

    const selectedCategoryIds = values.categories;
    const subcategoriesByParentId = _.groupBy(currSubcategories, 'parentId');
    const selectedCategorySubcategoryIds = _.map(
      selectedCategoryIds,
      (categoryId) => _.map(subcategoriesByParentId[categoryId], 'id')
    );
    const categoriesIdsFromParentIds =
      !isSubcategorySelected && selectedCategorySubcategoryIds;

    const valuesToSubmit = _.omit(
      {
        ...values,
        regions: selectedRegions.filter((item) => {
          return regions.includes(item);
        }),
        categories: categoriesIdsFromParentIds || values.subcategories,
      },
      'subcategories'
    );

    const filteredParams = _.toPairs(
      _.pickBy(
        valuesToSubmit,
        (value) => value && !(Array.isArray(value) && !value.length)
      )
    );

    setSearchParams(filteredParams);
  };

  useEffect(() => {
    if (selectedCategoriesIds.length > 0) {
      const filteredSubcategories = _.filter(categories, (item) =>
        _.includes(_.flatten(selectedCategoriesIds), item.parentId)
      );
      const subcategories = _.filter(categories, 'parentId');

      setSubcategoryUnits(
        !_.isEmpty(filteredSubcategories)
          ? filteredSubcategories
          : subcategories
      );

      const filteredSelectedSubcategoriesIds = _.intersection(
        _.flatten(selectedSubcategoriesIds),
        _.map(filteredSubcategories, 'id')
      );

      setSelectedSubcategoriesIds(filteredSelectedSubcategoriesIds);
    }
  }, [selectedCategoriesIds, categories]);

  useEffect(() => {
    setInitialValues({
      keyword: searchParams.get('keyword') || '',
      minQuantity: searchParams.get('minQuantity') || '',
      maxQuantity: searchParams.get('maxQuantity') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      users: searchParams.get('users')
        ? getNumbersArray(searchParams.get('users'))
        : [],
      categories: selectedCategoriesIds,
      subcategories: selectedSubcategoriesIds,
      lotType: searchParams.get('lotType') || '',
      countries: searchParams.get('countries')
        ? searchParams.get('countries').split(',').map(Number)
        : [],
      regions: searchParams.get('regions')
        ? searchParams.get('regions').split(',')
        : [],
    });
  }, [searchParams]);

  useEffect(() => {
    const filteredCountries = _.filter(countries, (item) => {
      return _.includes(selectedCountry, item.id);
    });
    const regions = _.flatMap(filteredCountries, (country) => country.regions);

    setRegions(regions);
  }, [searchParams, selectedCountry]);

  useEffect(() => {
    if (!regions.length) {
      const regions = _.flatMap(countries, (country) => country.regions);

      setRegions(regions);
    }
  }, [countries]);

  return (
    <div className={styles.filtersWrapp}>
      <Formik
        initialValues={initialValues}
        onSubmit={applyFilters}
        key={JSON.stringify(initialValues)}
      >
        {({ resetForm, values, setFieldValue }) => (
          <Form>
            <CustomTextField
              placeholder="Enter the text"
              label="Search (title, description, variety)"
              id="keyword"
              name="keyword"
              required={false}
              fieldType="filterInput"
              value={values.keyword}
            />
            <div className={styles.inputWrapp}>
              <CustomTextField
                placeholder="Min quantity"
                label="Min quantity"
                id="minQuantity"
                name="minQuantity"
                required={false}
                fieldType="filterInput"
                type="number"
                value={values.minQuantity}
              />
              <CustomTextField
                placeholder="Max quantity"
                label="Max quantity"
                id="maxQuantity"
                name="maxQuantity"
                required={false}
                fieldType="filterInput"
                type="number"
                value={values.maxQuantity}
              />
            </div>
            <div className={styles.inputWrapp}>
              <CustomTextField
                placeholder="Min price"
                label="Min price"
                id="minPrice"
                name="minPrice"
                required={false}
                fieldType="filterInput"
                type="number"
                value={values.minPrice}
              />
              <CustomTextField
                placeholder="Max price"
                label="Max price"
                id="maxPrice"
                name="maxPrice"
                required={false}
                fieldType="filterInput"
                type="number"
                value={values.maxPrice}
              />
            </div>
            <CustomMultiSelect
              units={users}
              name="users"
              disabled={false}
              placeholder="Select owners"
              itemFieldName="username"
              itemFieldNameSecond="name"
              label="Owners"
              required={false}
              fieldType="filterSelect"
              wrappType="filterWrapp"
              onChange={(e) => {
                setFieldValue('users', e.target.value);
              }}
            />

            <CustomMultiSelect
              units={parentCategories}
              name="categories"
              disabled={false}
              placeholder="Select category"
              itemFieldName="title"
              label="Category"
              required={false}
              fieldType="filterSelect"
              wrappType="filterWrapp"
              onChange={(e) => {
                setFieldValue('categories', e.target.value);
                setSelectedCategoriesIds(e.target.value);
              }}
            />

            <CustomMultiSelect
              units={subcategoryUnits}
              name="subcategories"
              disabled={false}
              placeholder="Select subcategory"
              itemFieldName="title"
              label="Subcategory"
              required={false}
              fieldType="filterSelect"
              wrappType="filterWrapp"
              onChange={(e) => {
                setFieldValue('subcategories', e.target.value);
                setSelectedSubcategoriesIds(e.target.value);
              }}
            />
            <CustomSelect
              label="Lot type"
              disabled={false}
              name="lotType"
              units={['sell', 'buy', 'auctionSell']}
              placeholder="Select lot type"
              required={false}
              fieldType="filterSelect"
              wrappType="filterWrapp"
              value={values.lotType}
              setFieldValue={setFieldValue}
            />
            <CustomMultiSelect
              label="Countries"
              disabled={false}
              name="countries"
              units={countries}
              itemFieldName="name"
              placeholder="Select countries"
              required={false}
              fieldType="filterSelect"
              wrappType="filterWrapp"
              onChange={(e) => {
                setFieldValue('countries', e.target.value);
                setSelectedCountry(e.target.value);
              }}
            />
            <CustomMultiSelect
              label="Regions"
              disabled={false}
              name="regions"
              units={regions}
              placeholder="Select countries"
              required={false}
              fieldType="filterSelect"
              wrappType="filterWrapp"
              values={values.regions}
              onChange={(e) => {
                setFieldValue('regions', e.target.value);
                setSelectedRegions(e.target.value);
              }}
            />
            <div className={styles.buttonsWrap}>
              <CustomButton
                text="Apply filter"
                size="L"
                type="primary"
                typeOfButton="submit"
              />
              <CloseButton
                size="L"
                type="primary"
                handleClick={() => resetFilter(resetForm)}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Filters;
