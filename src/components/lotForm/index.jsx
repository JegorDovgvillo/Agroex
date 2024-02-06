import { Form, Formik } from 'formik';

import CustomTextField from '@customTextField';
import { CustomButton } from '@buttons/CustomButton';
import CustomSelect from '@customSelect';
import CustomDatePicker from '@components/customDatePicker';
import InfoModal from '@customModals/infoModal';

import styles from './lotForm.module.scss';

const LotForm = ({
  initialValues,
  handleSubmitClick,
  country,
  categories = {},
  users,
  formType,
  handleDeleteClick,
}) => {
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
              label="Title"
              id="title"
              placeholder="Enter the title"
              name="title"
            />
            <CustomSelect
              units={users}
              itemFieldName="username"
              name="userId"
              width="210px"
              disabled={false}
              margin="0 16px 24px 0"
              placeholder="Choose user"
            />
            <CustomSelect
              label="Location"
              units={country}
              itemFieldName="name"
              name="country"
              width="210px"
              disabled={false}
              margin="0 16px 24px 0"
              placeholder="Choose country"
            />
            <CustomTextField
              id="region"
              placeholder="Enter the region"
              name="region"
            />
          </div>
          <CustomTextField
            label="Description"
            width="888px"
            placeholder="Enter the description"
            name="description"
            multiline
            rows={4}
          />
          <div className={styles.inputBlock}>
            <CustomSelect
              label="Categories"
              units={categories}
              itemFieldName="title"
              name="category"
              width="210px"
              disabled={false}
              margin="0 16px 24px 0"
              placeholder="Choose category"
            />
            <CustomTextField
              id="subcategory"
              placeholder="Enter the subcategory"
              name="subcategory"
            />
            <CustomTextField
              label="Variety"
              id="variety"
              placeholder="Enter the variety"
              name="variety"
            />
            <CustomTextField
              label="Size"
              id="size"
              placeholder="Enter the size"
              required={false}
              name="size"
            />
          </div>
          <div className={styles.inputBlock}>
            <CustomTextField
              label="Packaging"
              id="packaging"
              placeholder="Enter the packaging"
              name="packaging"
              required={false}
            />
            <CustomTextField
              label="Quantity"
              id="quantity"
              placeholder="Enter the quantity"
              name="quantity"
            />
            <CustomTextField
              label="Price"
              id="price"
              name="price"
              placeholder="Enter the price"
            />
            <CustomSelect
              units={['USD']}
              name="priceUnits"
              disabled={true}
              placeholder="Currency"
              width="210px"
              margin="0 16px 24px 0"
            />
          </div>
          <div className={styles.inputBlock}>
            <CustomDatePicker
              value={values.expirationDate}
              onChange={(date) => setFieldValue('expirationDate', date)}
            />
            <CustomSelect
              id="lotType"
              name="lotType"
              units={['sell', 'buy']}
              disabled={false}
              placeholder="Lot type"
              width="210px"
            />
          </div>
          {formType === 'create' ? (
            <>
              <CustomButton
                text="Place an item"
                width="auto"
                typeOfButton="submit"
              />
              <InfoModal title="Success!" text="Your ad has been published" />
            </>
          ) : (
            <div className={styles.buttonsWrap}>
              <CustomButton
                text="Update an item"
                width="auto"
                typeOfButton="submit"
              />
              <CustomButton
                text="Delete an item"
                width="auto"
                typeOfButton="button"
                handleClick={handleDeleteClick}
              />
              <InfoModal title="Success!" text="Your ad has been published" />
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default LotForm;
