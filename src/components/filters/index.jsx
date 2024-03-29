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
    const valuesToSubmit = _.omit({
      ...values,
      regions: _.intersection(selectedRegions, regions),
      categories: selectedCategoriesIds,
      subcategories: _.intersection(
        selectedSubcategoriesIds,
        values.subcategories
      ),
    });

    const filteredParams = _.toPairs(
      _.pickBy(
        valuesToSubmit,
        (value) => value && !(Array.isArray(value) && !value.length)
      )
    );

    setSearchParams(filteredParams);
  };

  const handleChange = (e, fieldName, setFieldValue, action = null) => {
    setFieldValue(fieldName, e.target.value);
    action && action(e.target.value);
  };

  useEffect(() => {
    if (!_.isEmpty(selectedCategoriesIds)) {
      const filteredSubcategories = _.filter(categories, (item) =>
        _.includes(_.flatten(selectedCategoriesIds), item.parentId)
      );

      setSubcategoryUnits(filteredSubcategories);

      const filteredSelectedSubcategoriesIds = _.intersection(
        _.flatten(selectedSubcategoriesIds),
        _.map(filteredSubcategories, 'id')
      );

      setSelectedSubcategoriesIds(filteredSelectedSubcategoriesIds);
    } else {
      const subcategories = _.filter(categories, 'parentId');

      setSubcategoryUnits(subcategories);
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
      categories: searchParams.has('categories')
        ? searchParams.get('categories').split(',').map(Number)
        : [],
      subcategories: searchParams.has('subcategories')
        ? searchParams.get('subcategories').split(',').map(Number)
        : [],
      lotType: searchParams.get('lotType') || '',
      countries: searchParams.has('countries')
        ? searchParams.get('countries').split(',').map(Number)
        : [],
      regions: searchParams.has('regions')
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
    if (_.isEmpty(regions)) {
      const regions = _.flatMap(countries, (country) => country.regions);

      setRegions(regions);
    }
  }, [countries, regions]);

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
              setFieldValue={setFieldValue}
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
                setFieldValue={setFieldValue}
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
                setFieldValue={setFieldValue}
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
                setFieldValue={setFieldValue}
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
                setFieldValue={setFieldValue}
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
              onChange={(e) => handleChange(e, 'users', setFieldValue)}
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
              onChange={(e) =>
                handleChange(
                  e,
                  'categories',
                  setFieldValue,
                  setSelectedCategoriesIds
                )
              }
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
              onChange={(e) =>
                handleChange(
                  e,
                  'subcategories',
                  setFieldValue,
                  setSelectedSubcategoriesIds
                )
              }
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
              onChange={(e) =>
                handleChange(e, 'countries', setFieldValue, setSelectedCountry)
              }
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
              onChange={(e) =>
                handleChange(e, 'regions', setFieldValue, setSelectedRegions)
              }
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
