import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
//import { useNavigate } from 'react-router-dom';

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
  isCategoryFieldVisible,
  isSubcategoryFieldVisible,
  selectedCategoriesIds,
  setSelectedCategoriesIds,
  selectedSubcategoriesIds,
  setSelectedSubcategoriesIds,
}) => {
  const getNumbersArray = (searchParams) => searchParams.split(',').map(Number);

  const parentCategories = _.filter(categories, ['parentId', 0]);
  const subcategories = _.filter(categories, 'parentId');

  const [subcategoryUnits, setSubcategoryUnits] = useState([]);

  const initialValues = {
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
      ? getNumbersArray(searchParams.get('countries'))
      : [],
  };

  const resetFilter = (resetForm) => {
    setSelectedCategoriesIds([]);
    setSelectedSubcategoriesIds([]);
    setSearchParams('');
    resetForm();
  };

  const applyFilters = (values) => {
    setSelectedCategoriesIds(values.categories);
    const isSubcategorySelected = values.subcategories.length > 0;

    const categoriesIdsFromParentIds =
      !isSubcategorySelected &&
      _.map(values.categories, (categoryId) =>
        _.map(_.filter(subcategories, ['parentId', categoryId]), 'id')
      );

    const valuesToSubmit = _.omit(
      _.set(
        values,
        'categories',
        categoriesIdsFromParentIds || values.subcategories
      ),
      'subcategories'
    );
    console.log(values, valuesToSubmit, isSubcategorySelected);
    const filteredParams = _.toPairs(
      _.pickBy(
        valuesToSubmit,
        (value) => value && !(Array.isArray(value) && !value.length)
      )
    );

    setSearchParams(filteredParams);
  };

  useEffect(() => {
    const filteredSubcategories = _.chain(categories)
      .filter((item) => _.includes(selectedCategoriesIds, item.parentId))
      .value();
    const subcategories = _.filter(categories, 'parentId');

    setSubcategoryUnits(
      !_.isEmpty(filteredSubcategories) ? filteredSubcategories : subcategories
    );

    const filteredSelectedSubcategoriesIds = _.intersection(
      selectedSubcategoriesIds,
      filteredSubcategories
    );
    console.log(
      selectedSubcategoriesIds,
      filteredSubcategories,
      filteredSelectedSubcategoriesIds
    );
    setSelectedSubcategoriesIds(filteredSelectedSubcategoriesIds);
  }, [selectedCategoriesIds, categories]);

  console.log(
    selectedCategoriesIds,

    selectedSubcategoriesIds,
    initialValues
  );
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
              label="Owners"
              required={false}
              fieldType="filterSelect"
              wrappType="filterWrapp"
              onChange={(e) => {
                setFieldValue('users', e.target.value);
                //setSelectedCategoriesIds(e.target.value);
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
              wrappType={isCategoryFieldVisible ? 'filterWrapp' : 'hidden'}
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
              wrappType={isSubcategoryFieldVisible ? 'filterWrapp' : 'hidden'}
              onChange={(e) => {
                setFieldValue('subcategories', e.target.value);
                setSelectedSubcategoriesIds(e.target.value);
              }}
            />
            <CustomSelect
              label="Lot type"
              disabled={false}
              name="lotType"
              units={['sell', 'buy']}
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
                //setSelectedCategoriesIds(e.target.value);
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
