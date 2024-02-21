import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';

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
}) => {
  const navigate = useNavigate();

  const getNumbersArray = (searchParams) => searchParams.split(',').map(Number);

  const initialValues = {
    keyword: searchParams.get('keyword') || '',
    minQuantity: searchParams.get('minQuantity') || '',
    maxQuantity: searchParams.get('maxQuantity') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    users: searchParams.get('users')
      ? getNumbersArray(searchParams.get('users'))
      : [],
    categories: searchParams.get('categories')
      ? getNumbersArray(searchParams.get('categories'))
      : [],
    lotType: searchParams.get('lotType') || '',
    countries: searchParams.get('countries')
      ? getNumbersArray(searchParams.get('countries'))
      : [],
  };

  const resetFilter = (resetForm) => {
    setSearchParams('');
    navigate('/filters');
    resetForm();
  };

  const applyFilters = (values) => {
    navigate('/filters');

    const filteredParams = _.toPairs(
      _.pickBy(
        values,
        (value) => value && !(Array.isArray(value) && !value.length)
      )
    );

    setSearchParams(filteredParams);
  };

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
            />
            <CustomMultiSelect
              units={categories}
              name="categories"
              disabled={false}
              placeholder="Select category"
              itemFieldName="title"
              label="Category"
              required={false}
              fieldType="filterSelect"
              wrappType="filterWrapp"
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
