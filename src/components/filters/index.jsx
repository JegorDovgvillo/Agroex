import { Formik, Form } from 'formik';
import { useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';

import { filteredLots } from '@thunks/fetchLots';

import { CustomButton } from '../buttons/CustomButton';
import CustomTextField from '../customTextField';
import CustomSelect from '../customSelect';

import styles from './filters.module.scss';

const Filters = ({
  categories,
  countries,
  searchParams,
  setSearchParams,
  users,
}) => {
  const dispatch = useDispatch();

  const initialValues = {
    title: '',
    description: '',
    minQuantity: '',
    maxQuantity: '',
    minPrice: '',
    maxPrice: '',
    user: [],
    productCategory: [],
    lotType: '',
    varieties: '',
    countries: [],
    enabledByAdmin: '',
    keyword: '',
  };

  const resetFilter = (resetForm) => {
    setSearchParams('');
    resetForm();
  };

  return (
    <div className={styles.filtersWrapp}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          // const selectedValues = {
          //   ...values,
          //   user: Array.isArray(values.user)
          //     ? values.user.join(',')
          //     : values.user,
          //   productCategory: Array.isArray(values.productCategory)
          //     ? values.productCategory.join(',')
          //     : values.productCategory,
          //   // countries: Array.isArray(values.countries) ? values.countries.join(',') : values.countries,
          // };
          // console.log(selectedValues);
          setSearchParams(values);
          dispatch(filteredLots(searchParams));
        }}
      >
        {({ resetForm }) => (
          <Form>
            <CustomTextField
              placeholder="Enter the title"
              label="Title"
              id="title"
              name="title"
              required={false}
            />
            <CustomTextField
              placeholder="Enter the description"
              label="Description"
              id="description"
              name="description"
              required={false}
            />
            <CustomTextField
              placeholder="Enter the min Quantity"
              label="Min quantity"
              id="minQuantity"
              name="minQuantity"
              required={false}
            />
            <CustomTextField
              placeholder="Enter the max quantity"
              label="Max quantity"
              id="maxQuantity"
              name="maxQuantity"
              required={false}
            />
            <CustomTextField
              placeholder="Enter the min price"
              label="Min price"
              id="minPrice"
              name="minPrice"
              required={false}
            />
            <CustomTextField
              placeholder="Enter the max price"
              label="Max price"
              id="maxPrice"
              name="maxPrice"
              required={false}
            />
            <CustomSelect
              units={users}
              name="user"
              disabled={false}
              placeholder="Select sellers"
              itemFieldName="username"
              label="Sellers"
              required={false}
              multiple={true}
            />
            <CustomSelect
              units={categories}
              name="productCategory"
              disabled={false}
              placeholder="Select category"
              itemFieldName="title"
              label="Category"
              required={false}
              multiple={true}
            />
            <CustomSelect
              label="Lot type"
              disabled={false}
              name="lotType"
              units={['sell', 'buy']}
              placeholder="Select lot type"
              required={false}
            />
            <CustomTextField
              placeholder="Enter the varieties"
              label="Varieties"
              id="varieties"
              name="varieties"
              required={false}
            />
            <CustomSelect
              label="Countries"
              disabled={false}
              name="countries"
              units={countries}
              itemFieldName="name"
              placeholder="Select countries"
              required={false}
              multiple={true}
            />
            <CustomSelect
              label="Enabled lots"
              disabled={false}
              name="enabledByAdmin"
              units={['true', 'false']}
              required={false}
              placeholder="Select lot type"
            />
            <CustomTextField
              placeholder="Enter the keyword"
              label="Keyword"
              id="keyword"
              name="keyword"
              required={false}
            />
            <div>
              <CustomButton
                text="Apply filter"
                size="L"
                type="primary"
                typeOfButton="submit"
              />
              <CustomButton
                icon={<CloseIcon />}
                size="S"
                type="primary"
                typeOfButton="button"
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
