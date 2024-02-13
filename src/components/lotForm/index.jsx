import { Form, Formik } from 'formik';

import CustomTextField from '@customTextField';
import { CustomButton } from '@buttons/CustomButton';
import CustomSelect from '@customSelect';
import CustomDatePicker from '@components/customDatePicker';
import InfoModal from '@customModals/infoModal';
import ConfirmActionModal from '@customModals/confirmActionModal';

import { lotValidationSchema } from '@helpers/validationSchemes/lotValidationSchema';

import DragAndDrop from '../dragAndDrop';

import styles from './lotForm.module.scss';

const LotForm = ({
  selectedLot,
  handleSubmitClick,
  country,
  categories,
  users,
  formType,
  setConfirmStatus,
  showConfirm,
  files,
  setFiles,
  maxFilesPerDrop,
  setMaxFilesPerDrop,
  disabled,
  setDisabled,
}) => {
  const initialValues = {
    userId: selectedLot?.userId,
    title: selectedLot?.title,
    country: selectedLot?.location.countryId,
    region: selectedLot?.location.region,
    category: selectedLot?.productCategoryId,
    subcategory: selectedLot?.subcategory,
    variety: selectedLot?.variety,
    description: selectedLot?.description,
    packaging: selectedLot?.packaging,
    quantity: selectedLot?.quantity,
    price: selectedLot?.pricePerTon * selectedLot?.quantity || undefined,
    priceUnits: 'USD',
    lotType: selectedLot?.lotType,
    size: selectedLot?.size,
    expirationDate: selectedLot?.expirationDate,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { resetForm }) => {
        handleSubmitClick(values, resetForm);
      }}
      validationSchema={lotValidationSchema}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        setFieldValue,
        setFieldTouched,
      }) => (
        <Form>
          <div className={styles.inputBlock}>
            <CustomTextField
              label="Title"
              id="title"
              placeholder="Enter the title"
              name="title"
              value={values.title}
              errors={errors.title}
              touched={touched.title}
            />
            <CustomSelect
              label="User"
              units={users}
              itemFieldName="username"
              name="userId"
              placeholder="Choose user"
              value={values.userId}
              errors={errors.userId}
              touched={touched.userId}
            />
            <CustomSelect
              label="Location"
              units={country}
              itemFieldName="name"
              name="country"
              placeholder="Choose country"
              value={values.country}
              errors={errors.country}
              touched={touched.country}
            />
            <CustomTextField
              label="Region"
              id="region"
              placeholder="Enter the region"
              name="region"
              value={values.region}
              errors={errors.region}
              touched={touched.region}
            />
          </div>
          <CustomTextField
            label="Description"
            placeholder="Enter the description"
            name="description"
            multiline
            rows={4}
            type="textarea"
            value={values.description}
            errors={errors.description}
            touched={touched.description}
          />
          <div className={styles.inputBlock}>
            <CustomSelect
              label="Categories"
              units={categories}
              itemFieldName="title"
              name="category"
              placeholder="Choose category"
              value={values.category}
              errors={errors.category}
              touched={touched.category}
            />
            <CustomTextField
              label="Subcategory"
              id="subcategory"
              placeholder="Enter the subcategory"
              name="subcategory"
              value={values.subcategory}
              errors={errors.subcategory}
              touched={touched.subcategory}
            />
            <CustomTextField
              label="Variety"
              id="variety"
              placeholder="Enter the variety"
              name="variety"
              value={values.variety}
              errors={errors.variety}
              touched={touched.variety}
            />
            <CustomTextField
              label="Size"
              id="size"
              placeholder="Enter the size"
              required={false}
              name="size"
              value={values.size}
              errors={errors.size}
              touched={touched.size}
            />
          </div>
          <div className={styles.inputBlock}>
            <CustomTextField
              label="Packaging"
              id="packaging"
              placeholder="Enter the packaging"
              name="packaging"
              required={false}
              value={values.packaging}
              errors={errors.packaging}
              touched={touched.packaging}
            />
            <CustomTextField
              label="Quantity"
              id="quantity"
              placeholder="Enter the quantity"
              name="quantity"
              value={values.quantity}
              errors={errors.quantity}
              touched={touched.quantity}
            />
            <CustomTextField
              label="Price"
              id="price"
              name="price"
              placeholder="Enter the price"
              value={values.price}
              errors={errors.price}
              touched={touched.price}
            />
            <CustomSelect
              label="Currency"
              units={['USD']}
              name="priceUnits"
              disabled={true}
              placeholder="Currency"
              value={values.priceUnits}
              errors={errors.priceUnits}
              touched={touched.priceUnits}
            />
          </div>
          <div className={styles.inputBlock}>
            <CustomDatePicker
              value={values.expirationDate}
              onChange={(date) => {
                setFieldTouched('expirationDate', true);
                setFieldValue('expirationDate', date);
              }}
              errors={errors.expirationDate}
              touched={touched.expirationDate}
            />
            <CustomSelect
              label="Lot type"
              id="lotType"
              name="lotType"
              units={['sell', 'buy']}
              placeholder="Lot type"
              value={values.lotType}
              errors={errors.lotType}
              touched={touched.lotType}
            />
          </div>
          <DragAndDrop
            files={files}
            setFiles={setFiles}
            maxFilesPerDrop={maxFilesPerDrop}
            setMaxFilesPerDrop={setMaxFilesPerDrop}
            disabled={disabled}
            setDisabled={setDisabled}
          />
          {formType === 'create' ? (
            <>
              <CustomButton
                text="Place an item"
                width="auto"
                typeOfButton="submit"
                disabled={!isValid}
              />
              <InfoModal title="Success!" text="Your ad has been published" />
            </>
          ) : (
            <div className={styles.buttonsWrap}>
              <CustomButton
                text="Update an item"
                width="auto"
                typeOfButton="submit"
                disabled={!isValid}
              />
              <CustomButton
                text="Delete an item"
                width="auto"
                typeOfButton="button"
                handleClick={showConfirm}
              />
              <ConfirmActionModal
                text="This action delete the lot. Do you confirm the action?"
                setConfirmStatus={setConfirmStatus}
              />
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default LotForm;
