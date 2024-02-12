import styles from './filters.module.scss';
import { Formik, Form } from 'formik';
import { useDispatch } from 'react-redux';
import { fetchLots, filteredLots } from '../../store/thunks/fetchLots';
import { CustomButton } from '../buttons/CustomButton';
import CloseIcon from '@mui/icons-material/Close';
import CustomTextField from '../customTextField';
import CustomSelect from '../customSelect';

const Filters = ({ categories, countries }) => {
  const dispatch = useDispatch();

  const initialValues = {
    title: '',
    description: '',
    minQuantity: 0,
    maxQuantity: 100,
    minPrice: 0,
    maxPrice: 1000,
    productCategory: '',
    lotType: '',
    varieties: '',
    countries: '',
    enabledByAdmin: '',
    keyword: '',
  };

  const resetFilter = (resetForm) => {
    dispatch(fetchLots());
    resetForm();
  };

  return (
    <div className={styles.filtersWrapp}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          dispatch(filteredLots(values));
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
              units={categories}
              name="productCategory"
              disabled={false}
              placeholder="Enter the category"
              itemFieldName="title"
              label="Category"
              required={false}
            />
            <CustomSelect
              label="Lot type"
              disabled={false}
              name="lotType"
              units={['sell', 'buy']}
              placeholder="Enter the lot type"
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
              placeholder="Enter the countries"
              required={false}
            />
            <CustomSelect
              label="Enabled lots"
              disabled={false}
              name="enabledByAdmin"
              units={['true', 'false']}
              required={false}
              // placeholder="Enter the countries"
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
