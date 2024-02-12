import { Formik, Form } from 'formik';
import { useDispatch } from 'react-redux';

import { filteredLots } from '@thunks/fetchLots';

import { CustomButton } from '../buttons/CustomButton';
import CustomTextField from '../customTextField';
import CustomMultiSelect from '../customMultiSelect';
import { CloseButton } from '../buttons/CloseButton';
import CustomSelect from '../customSelect';

import styles from './filters.module.scss';
import { Formik, Form } from 'formik';
import { useDispatch } from 'react-redux';
import { fetchLots, filteredLots } from '../../store/thunks/fetchLots';
import { CustomButton } from '../buttons/CustomButton';
import CloseIcon from '@mui/icons-material/Close';
import CustomTextField from '../customTextField';
import CustomSelect from '../customSelect';

const Filters = ({
  categories,
  countries,
  searchParams,
  setSearchParams,
  users,
}) => {
  const dispatch = useDispatch();

  const initialValues = {
    keyword: '',
    minQuantity: '',
    maxQuantity: '',
    minPrice: '',
    maxPrice: '',
    users: [],
    productCategory: [],
    lotType: '',
    countries: [],
  };

  const resetFilter = (resetForm) => {
    setSearchParams('');
    resetForm();
  };

  const applyFilters = (values) => {
    setSearchParams(values);
    dispatch(filteredLots(searchParams));
  };

  return (
    <div className={styles.filtersWrapp}>
      <Formik initialValues={initialValues} onSubmit={applyFilters}>
        {({ resetForm, values }) => (
          <Form>
            <CustomTextField
              placeholder="Enter the keyword"
              label="Keyword"
              id="keyword"
              name="keyword"
              required={false}
              fieldType="filterInput"
              value={values.keyword}
            />
            <div className={styles.inputWrapp}>
              <CustomTextField
                placeholder="Enter the min Quantity"
                label="Min quantity"
                id="minQuantity"
                name="minQuantity"
                required={false}
                fieldType="filterInput"
                type="number"
                value={values.minQuantity}
              />
              <CustomTextField
                placeholder="Enter the max quantity"
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
                placeholder="Enter the min price"
                label="Min price"
                id="minPrice"
                name="minPrice"
                required={false}
                fieldType="filterInput"
                type="number"
                value={values.minPrice}
              />
              <CustomTextField
                placeholder="Enter the max price"
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
              name="productCategory"
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
