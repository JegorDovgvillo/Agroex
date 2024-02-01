import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Formik } from 'formik';

import CustomTextField from '@components/customTextField';
import { CustomButton } from '@components/buttons/CustomButton';
import CustomSelect from '@components/customSelect';
import CustomDatePicker from '@components/customDatePicker';
import CustomModal from '@components/customModal';

import { fetchUsers } from '@store/thunks/fetchUsers';
import { usersListSelector } from '@store/slices/usersListSlice';
import { openModal } from '@store/slices/modalSlice';
import { fetchCategories } from '@store/thunks/fetchCategories';
import { categoriesSelector } from '@store/slices/categoriesSlice';
import { countrySelector } from '@store/slices/countriesSlice';
import { fetchCountries } from '@store/thunks/fetchCountries';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

import styles from './createNewLot.module.scss';

const CreateNewLot = () => {
  const dispatch = useDispatch();
  const users = useSelector(usersListSelector);
  const categories = useSelector(categoriesSelector);
  const country = useSelector(countrySelector);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchCategories());
    dispatch(fetchCountries());
  }, [dispatch]);
  const initialValues = {
    userId: '',
    title: '',
    country: '',
    region: '',
    category: '',
    subcategory: '',
    variety: '',
    description: '',
    packaging: '',
    quantity: '',
    price: '',
    priceUnits: '',
    lotType: '',
    size: '',
    expirationDate: '',
  };

  const handleSubmitClick = async (values, resetForm) => {
    const obj = {
      title: values.title,
      description: values.description,
      variety: values.variety,
      size: values.size,
      packaging: values.packaging,
      quantity: values.quantity,
      pricePerTon: (values.price / values.quantity).toFixed(2),
      currency: values.priceUnits,
      expirationDate: values.expirationDate,
      productCategoryId: values.category,
      lotType: values.lotType,
      userId: values.userId,
      location: {
        countryId: values.country,
        region: values.region,
      },
    };
    await axiosInstance.post(ENDPOINTS.LOTS, obj);
    dispatch(openModal());
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { resetForm }) => {
        handleSubmitClick(values, resetForm);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className={styles.inputBlock}>
            <CustomTextField
              label={'Title'}
              id={'title'}
              placeholder={'Enter the title'}
              name={'title'}
            />
            <CustomSelect
              units={users}
              itemFieldName={'username'}
              name={'userId'}
              width={'210px'}
              disabled={false}
              margin={'0 16px 24px 0'}
              placeholder={'Choose user'}
            />
            <CustomSelect
              label={'Location'}
              units={country}
              itemFieldName={'title'}
              name={'country'}
              width={'210px'}
              disabled={false}
              margin={'0 16px 24px 0'}
              placeholder={'Choose country'}
            />
            <CustomTextField
              id={'region'}
              placeholder={'Enter the region'}
              name={'region'}
            />
          </div>
          <CustomTextField
            label={'Description'}
            width={'888px'}
            placeholder={'Enter the description'}
            name={'description'}
            multiline
            rows={4}
          />
          <div className={styles.inputBlock}>
            <CustomSelect
              label={'Categories'}
              units={categories}
              itemFieldName={'title'}
              name="category"
              width={'210px'}
              disabled={false}
              margin={'0 16px 24px 0'}
              placeholder={'Choose category'}
            />
            <CustomTextField
              id={'subcategory'}
              placeholder={'Enter the subcategory'}
              name={'subcategory'}
            />
            <CustomTextField
              label={'Variety'}
              id={'variety'}
              placeholder={'Enter the variety'}
              name={'variety'}
            />
            <CustomTextField
              label={'Size'}
              id={'size'}
              placeholder={'Enter the size'}
              required={false}
              name={'size'}
            />
          </div>
          <div className={styles.inputBlock}>
            <CustomTextField
              label={'Packaging'}
              id={'packaging'}
              placeholder={'Enter the packaging'}
              name={'packaging'}
              required={false}
            />
            <CustomTextField
              label={'Quantity'}
              id={'quantity'}
              placeholder={'Enter the quantity'}
              name={'quantity'}
            />
            <CustomTextField
              label={'Price'}
              id={'price'}
              name={'price'}
              placeholder={'Enter the price'}
            />
            <CustomSelect
              units={['USD']}
              name={'priceUnits'}
              disabled={false}
              placeholder={'Currency'}
              width={'210px'}
              margin={'0 16px 24px 0'}
            />
          </div>
          <div className={styles.inputBlock}>
            <CustomDatePicker
              value={values.expirationDate}
              onChange={(date) => setFieldValue('expirationDate', date)}
            />
            <CustomSelect
              id={'lotType'}
              name={'lotType'}
              units={['sell', 'buy']}
              disabled={false}
              placeholder={'Lot type'}
              width={'210px'}
            />
          </div>
          <CustomButton
            text={'Place an item'}
            width={'auto'}
            typeOfButton={'submit'}
          />
          <CustomModal title={'Success!'} text={'Your ad has been published'} />
        </Form>
      )}
    </Formik>
  );
};

export default CreateNewLot;
