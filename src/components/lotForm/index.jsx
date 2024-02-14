import { useEffect, useRef, useState } from 'react';
import { Form, Formik } from 'formik';

import { FormHelperText } from '@mui/material';

import CustomTextField from '@customTextField';
import { CustomButton } from '@buttons/CustomButton';
import CustomSelect from '@customSelect';
import CustomDatePicker from '@components/customDatePicker';
import InfoModal from '@customModals/infoModal';
import ConfirmActionModal from '@customModals/confirmActionModal';

import { lotValidationSchema } from '@helpers/validationSchemes/lotValidationSchemes';

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
  isImageAdded,
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

  const [isFirstSubmit, setIsFirstSubmit] = useState(true);
  const formRef = useRef(null);

  useEffect(() => {
    if (
      (formType !== 'create' && formRef.current) ||
      (formType === 'create' && isFirstSubmit && isFirstSubmit)
    ) {
      formRef.current.validateForm();
    }
  }, [formRef, isFirstSubmit, formType]);

  const handlePlaceItemBtnClick = () => {
    isFirstSubmit && setIsFirstSubmit(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { resetForm }) => {
        handleSubmitClick(values, resetForm);
      }}
      validationSchema={lotValidationSchema}
      innerRef={formRef}
      enableReinitialize
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
              touched={
                formType === 'create' && isFirstSubmit && isFirstSubmit
                  ? touched.title
                  : true
              }
            />
            <CustomSelect
              label="User"
              units={users}
              itemFieldName="username"
              name="userId"
              placeholder="Choose user"
              value={values.userId}
              errors={errors.userId}
              touched={
                formType === 'create' && isFirstSubmit ? touched.userId : true
              }
            />
            <CustomSelect
              label="Location"
              units={country}
              itemFieldName="name"
              name="country"
              placeholder="Choose country"
              value={values.country}
              errors={errors.country}
              touched={
                formType === 'create' && isFirstSubmit ? touched.country : true
              }
            />
            <CustomTextField
              label="Region"
              id="region"
              placeholder="Enter the region"
              name="region"
              value={values.region}
              errors={errors.region}
              touched={
                formType === 'create' && isFirstSubmit ? touched.region : true
              }
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
            touched={
              formType === 'create' && isFirstSubmit
                ? touched.description
                : true
            }
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
              touched={
                formType === 'create' && isFirstSubmit ? touched.category : true
              }
            />
            <CustomTextField
              label="Subcategory"
              id="subcategory"
              placeholder="Enter the subcategory"
              name="subcategory"
              value={values.subcategory}
              errors={errors.subcategory}
              touched={
                formType === 'create' && isFirstSubmit
                  ? touched.subcategory
                  : true
              }
            />
            <CustomTextField
              label="Variety"
              id="variety"
              placeholder="Enter the variety"
              name="variety"
              value={values.variety}
              errors={errors.variety}
              touched={
                formType === 'create' && isFirstSubmit ? touched.variety : true
              }
            />
            <CustomTextField
              label="Size"
              id="size"
              placeholder="Enter the size"
              required={false}
              name="size"
              value={values.size}
              errors={errors.size}
              touched={
                formType === 'create' && isFirstSubmit ? touched.size : true
              }
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
              touched={
                formType === 'create' && isFirstSubmit
                  ? touched.packaging
                  : true
              }
            />
            <CustomTextField
              label="Quantity"
              id="quantity"
              type="number"
              placeholder="Enter the quantity"
              name="quantity"
              value={values.quantity}
              errors={errors.quantity}
              touched={
                formType === 'create' && isFirstSubmit ? touched.quantity : true
              }
            />
            <CustomTextField
              label="Price"
              id="price"
              name="price"
              type="number"
              placeholder="Enter the price"
              value={values.price}
              errors={errors.price}
              touched={
                formType === 'create' && isFirstSubmit ? touched.price : true
              }
            />
            <CustomSelect
              label="Currency"
              units={['USD']}
              name="priceUnits"
              disabled={true}
              placeholder="Currency"
              value={values.priceUnits}
              errors={errors.priceUnits}
              touched={
                formType === 'create' && isFirstSubmit
                  ? touched.priceUnits
                  : true
              }
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
              touched={
                formType === 'create' && isFirstSubmit
                  ? touched.expirationDate
                  : true
              }
            />
            <CustomSelect
              label="Lot type"
              id="lotType"
              name="lotType"
              units={['sell', 'buy']}
              placeholder="Lot type"
              value={values.lotType}
              errors={errors.lotType}
              touched={
                formType === 'create' && isFirstSubmit ? touched.lotType : true
              }
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
          {!isImageAdded && (
            <FormHelperText error className={styles.dropDownHelperText}>
              At least one picture must be uploaded
            </FormHelperText>
          )}
          {formType === 'create' ? (
            <>
              <CustomButton
                text="Place an item"
                width="auto"
                typeOfButton="submit"
                handleClick={handlePlaceItemBtnClick}
                disabled={!isFirstSubmit && (!isValid || !isImageAdded)}
              />
              <InfoModal title="Success!" text="Your ad has been published" />
            </>
          ) : (
            <div className={styles.buttonsWrap}>
              <CustomButton
                text="Update an item"
                width="auto"
                typeOfButton="submit"
                disabled={!isValid || !isImageAdded}
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
