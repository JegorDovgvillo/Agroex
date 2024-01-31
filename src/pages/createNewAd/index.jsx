import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Formik } from 'formik';

import CustomTextField from '@components/customTextField';
import { CustomButton } from '@components/buttons/CustomButton';
import CustomSelect from '@components/customSelect';
import CustomDatePicker from '@components/customDatePicker';
import CustomModal from '@components/customModal';

import { fetchUsers } from '@store/thunks/fetchUsers';
import { usersSelector } from '@store/slices/usersSlice';
import { openModal } from '@store/slices/modalSlice';

import axiosInstance from '@helpers/axiosInstance';
import ENDPOINTS from '@helpers/endpoints';

import styles from './createNewAd.module.scss';

const CreateNewAd = () => {
  const dispatch = useDispatch();
  const users = useSelector(usersSelector);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <Formik
      initialValues={{
        user: '',
        title: '',
        country: '',
        city: '',
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
      }}
      onSubmit={async (values, { resetForm }) => {
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
          productCategory: {
            title: values.subcategory,
          },
          lotType: values.lotType,
          user: values.user,
          location: {
            country: values.country,
            region: values.city,
          },
        };
        await axiosInstance.post(ENDPOINTS.LOTS, obj);
        dispatch(openModal(true));
        resetForm();
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
              units={users.map((item) => item)}
              name="user"
              width={'210px'}
              disabled={false}
              margin={'0 16px 24px 0'}
              placeholder={'Choose user'}
            />
            <CustomTextField
              label={'Location'}
              id={'country'}
              placeholder={'Enter the country'}
              name={'country'}
            />
            <CustomTextField
              id={'city'}
              placeholder={'Enter the city'}
              name={'city'}
            />
          </div>
          <CustomTextField
            label={'Description'}
            id={'description outlined-multiline-static'}
            width={'888px'}
            placeholder={'Enter the description'}
            name={'description'}
            multiline
            rows={4}
          />
          <div className={styles.inputBlock}>
            <CustomTextField
              label={'Category'}
              id={'category'}
              placeholder={'Enter the category'}
              name={'category'}
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
              name="priceUnits"
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
          <CustomButton text={'Place an item'} width={'auto'} type={'submit'} />
          <CustomModal title={'Success!'} text={'Your ad has been published'} />
        </Form>
      )}
    </Formik>
  );
};

export default CreateNewAd;
