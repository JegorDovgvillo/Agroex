import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import { Duration } from 'luxon';
import _ from 'lodash';

import { FormHelperText } from '@mui/material';

import {
  lotValidationSchema,
  auctionLotValidationSchema,
} from '@helpers/validationSchemes/lotValidationSchemes';
import getSanitizedString from '@helpers/getSanitizedString';
import { setCorrectedTimeZone } from '@helpers/getCorrectTime';
import { getDHMSFromMilliseconds } from '@helpers/getDHMSFromMilliseconds';
import { selectCategoryByParentId } from '@slices/categoriesSlice';
import { fetchSubcategoryByParentId } from '@thunks/fetchCategories';

import CustomTextField from '@customTextField';
import CustomAutocompleteField from '../customAutocomplete';
import CustomMultipleAutocompleteField from '../customMultipleAutocomplete';
import { CustomButton } from '@buttons/CustomButton';
import CustomSelect from '@customSelect';
import CustomDatePicker from '@components/customDatePicker';
import InfoModal from '@customModals/infoModal';
import ConfirmActionModal from '@customModals/confirmActionModal';
import DragAndDrop from '../dragAndDrop';

import styles from './lotForm.module.scss';
import Map from '../map';

const getFormattedString = (str) => {
  return _.words(_.startCase(str)).join(' ').toLowerCase();
};

const LotForm = ({
  selectedLot,
  handleSubmitClick,
  country,
  categories,
  tags,
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
  markerCoordinate,
  setMarkerCoordinate,
  selectedCountry,
}) => {
  const dispatch = useDispatch();
  const {
    days = 0,
    hours = 0,
    minutes = 0,
  } = getDHMSFromMilliseconds(selectedLot?.duration);

  const [disabledMap, setDisabledMap] = useState(true);
  const lotType = getFormattedString(selectedLot?.lotType);

  const initialValues = {
    title: selectedLot?.title,
    country: selectedLot?.location.countryId,
    region: selectedLot?.location.region,
    category: selectedLot?.productCategory.parentId,
    subcategory: selectedLot?.productCategory.title,
    variety: selectedLot?.variety,
    description: selectedLot?.description,
    packaging: selectedLot?.packaging,
    quantity: selectedLot?.quantity,
    price: selectedLot?.price,
    minPrice: selectedLot?.minPrice,
    priceUnits: 'USD',
    lotType: lotType,
    size: selectedLot?.size,
    expirationDate: selectedLot?.expirationDate,
    duration: selectedLot?.expirationDate,
    tags: selectedLot?.tags,
    days: days,
    hours: hours,
    minutes: minutes,
    bets: selectedLot?.bets,
  };

  const [isFirstSubmit, setIsFirstSubmit] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialValues.category
  );
  const [selectedLotType, setSelectedLotType] = useState(initialValues.lotType);
  const [isAuctionLot, setIsAuctionLot] = useState(
    selectedLotType === 'auction sell'
  );
  const [validationSchema, setValidationSchema] = useState(lotValidationSchema);

  const subcategories = useSelector((state) =>
    selectCategoryByParentId(state, selectedCategoryId)
  );
  const userInfo = useSelector((state) => state.usersList.userInfo);
  const [userTimeZone, setUserTimeZone] = useState(null);
  const formRef = useRef(null);

  const handlePlaceItemBtnClick = () => {
    isFirstSubmit && setIsFirstSubmit(false);
  };

  const isCreateNotSubmittedForm = formType === 'create' && isFirstSubmit;

  const getTotalMilliseconds = (values) => {
    const { days, hours, minutes } = values;

    return Duration.fromObject({
      days: _.toNumber(days),
      hours: _.toNumber(hours),
      minutes: _.toNumber(minutes),
    }).as('milliseconds');
  };

  const getNewTags = (values) => {
    const newTags = _.map(values.tags, (tagTitle) => {
      const clearedTagTitle = _.toLower(getSanitizedString(tagTitle));
      const tag = _.find(
        tags,
        (tag) => _.toLower(tag.title) === clearedTagTitle
      );

      return tag || { title: getSanitizedString(tagTitle) };
    });

    return newTags;
  };

  const handleSubmit = (values, { resetForm }) => {
    const newValues = _.omit(values, ['days', 'hours', 'minutes']);
    const subcategory = _.find(subcategories, { title: values.subcategory });

    if (subcategory) {
      newValues.subcategory = subcategory.id;
    }

    newValues.lotType = _.camelCase(values.lotType);
    newValues.duration = getTotalMilliseconds(values);
    newValues.tags = getNewTags(values);
    newValues.expirationDate = setCorrectedTimeZone(
      values.expirationDate,
      userTimeZone
    );

    const sanitizedValues = _.mapValues(newValues, (value) => {
      if (_.isString(value)) {
        return getSanitizedString(value);
      }

      return value;
    });

    handleSubmitClick(sanitizedValues, resetForm);
  };

  useEffect(() => {
    if (!userInfo) return;

    setUserTimeZone(userInfo.zoneinfo);
  }, [userInfo]);

  useEffect(() => {
    if (
      (formType !== 'create' && formRef.current) ||
      (formType === 'create' && isFirstSubmit && isFirstSubmit)
    ) {
      formRef.current.validateForm();
    }
  }, [formRef, isFirstSubmit, formType]);

  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(fetchSubcategoryByParentId(selectedCategoryId));
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (selectedLotType) {
      const isAuctionLot = selectedLotType === 'auction sell';

      setIsAuctionLot(isAuctionLot);
      setValidationSchema(
        isAuctionLot ? auctionLotValidationSchema : lotValidationSchema
      );
    }
  }, [selectedLotType]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
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
        <>
          <div className={styles.formContainer}>
            <Form className={styles.newLotForm}>
              <div className={styles.inputBlock}>
                <CustomTextField
                  label="Title"
                  id="title"
                  placeholder="Enter the title"
                  name="title"
                  value={values.title}
                  errors={errors.title}
                  touched={!isCreateNotSubmittedForm || touched.title}
                />
                <CustomSelect
                  label="Location"
                  units={country}
                  itemFieldName="name"
                  name="country"
                  placeholder="Choose country"
                  value={values.country}
                  errors={errors.country}
                  touched={!isCreateNotSubmittedForm || touched.country}
                  setFieldValue={setFieldValue}
                  disabled={disabledMap}
                />
                <CustomTextField
                  label="Region"
                  id="region"
                  placeholder="Enter the region"
                  name="region"
                  disabled={true}
                  value={values.region}
                  errors={errors.region}
                  touched={!isCreateNotSubmittedForm || touched.region}
                />
                <div className={styles.disabledMapWrapp}>
                  <CustomButton
                    text="Choose country"
                    typeOfButton="button"
                    handleClick={() => setDisabledMap(false)}
                    disabled={!disabledMap}
                    buttonClass="disabledMap"
                  />
                </div>
              </div>

              <div className={styles.inputBlock}>
                <CustomSelect
                  label="Lot type"
                  id="lotType"
                  name="lotType"
                  units={['sell', 'buy', 'auction sell']}
                  placeholder="Lot type"
                  value={values.lotType}
                  errors={errors.lotType}
                  touched={!isCreateNotSubmittedForm || touched.lotType}
                  handleChange={setSelectedLotType}
                  setFieldValue={setFieldValue}
                />
                <CustomSelect
                  label="Category"
                  units={categories}
                  itemFieldName="title"
                  name="category"
                  placeholder="Choose category"
                  value={values.category}
                  errors={errors.category}
                  touched={!isCreateNotSubmittedForm || touched.category}
                  handleChange={setSelectedCategoryId}
                  setFieldValue={setFieldValue}
                />

                <CustomAutocompleteField
                  label="Subcategory"
                  id="subcategory"
                  placeholder="Enter the subcategory"
                  name="subcategory"
                  value={values.subcategory}
                  errors={errors.subcategory}
                  touched={!isCreateNotSubmittedForm || touched.subcategory}
                  options={subcategories}
                  setFieldValue={setFieldValue}
                />

                <CustomTextField
                  label="Variety"
                  id="variety"
                  placeholder="Enter the variety"
                  name="variety"
                  value={values.variety}
                  errors={errors.variety}
                  touched={!isCreateNotSubmittedForm || touched.variety}
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
                touched={!isCreateNotSubmittedForm || touched.description}
                fieldType="textarea"
              />
              <div className={styles.inputBlock}>
                <CustomTextField
                  label="Packaging"
                  id="packaging"
                  placeholder="Enter the packaging"
                  name="packaging"
                  required={false}
                  value={values.packaging}
                  errors={errors.packaging}
                  touched={!isCreateNotSubmittedForm || touched.packaging}
                />
                <CustomTextField
                  label="Quantity"
                  id="quantity"
                  type="number"
                  placeholder="Enter the quantity"
                  name="quantity"
                  value={values.quantity}
                  errors={errors.quantity}
                  touched={!isCreateNotSubmittedForm || touched.quantity}
                />
                <CustomTextField
                  label="Size"
                  id="size"
                  placeholder="Enter the size"
                  required={false}
                  name="size"
                  value={values.size}
                  errors={errors.size}
                  touched={!isCreateNotSubmittedForm || touched.size}
                />
              </div>
              {isAuctionLot && (
                <div className={styles.inputBlock}>
                  <div className={styles.auctionLotDurationBlock}>
                    <h6 className={styles.auctionLotDurationTitle}>
                      Auction duration
                    </h6>
                    <div className={styles.auctionLotDurationInputs}>
                      <CustomTextField
                        id="days"
                        name="days"
                        type="number"
                        fieldType={'lotDuration'}
                        label="Days"
                        placeholder="Days"
                        value={values.days}
                        errors={errors.days}
                        touched={!isCreateNotSubmittedForm || touched.days}
                      />
                      <CustomTextField
                        id="hours"
                        name="hours"
                        type="number"
                        fieldType={'lotDuration'}
                        label="Hours"
                        placeholder="Hours"
                        value={values.hours}
                        errors={errors.hours}
                        touched={!isCreateNotSubmittedForm || touched.hours}
                      />
                      <CustomTextField
                        id="minutes"
                        name="minutes"
                        type="number"
                        fieldType={'lotDuration'}
                        label="Minutes"
                        placeholder="Minutes"
                        value={values.minutes}
                        errors={errors.minutes}
                        touched={!isCreateNotSubmittedForm || touched.minutes}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className={styles.inputBlock}>
                {!isAuctionLot && (
                  <CustomDatePicker
                    value={values.expirationDate}
                    onChange={(date) => {
                      setFieldTouched('expirationDate', true);
                      setFieldValue('expirationDate', date);
                    }}
                    errors={errors.expirationDate}
                    touched={
                      !isCreateNotSubmittedForm || touched.expirationDate
                    }
                  />
                )}
                {isAuctionLot && (
                  <CustomTextField
                    label="Min price"
                    id="minPrice"
                    name="minPrice"
                    type="number"
                    placeholder="Enter the min price"
                    value={values.minPrice}
                    errors={errors.minPrice}
                    touched={!isCreateNotSubmittedForm || touched.minPrice}
                  />
                )}
                <CustomTextField
                  label="Price"
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Enter the price"
                  value={values.price}
                  errors={errors.price}
                  touched={!isCreateNotSubmittedForm || touched.price}
                />
                <CustomSelect
                  label="Currency"
                  units={['USD']}
                  name="priceUnits"
                  disabled={true}
                  placeholder="Currency"
                  value={values.priceUnits}
                  errors={errors.priceUnits}
                  touched={!isCreateNotSubmittedForm || touched.priceUnits}
                  setFieldValue={setFieldValue}
                />
              </div>
              <div className={styles.inputBlock}></div>
              <div className={styles.inputBlock}>
                <CustomMultipleAutocompleteField
                  label="Tags"
                  id="tags"
                  fieldType="tags"
                  limitTags={4}
                  placeholder="Select or type a tag"
                  name="tags"
                  value={values.tags}
                  errors={errors.tags}
                  options={tags}
                  setFieldValue={setFieldValue}
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
                  <InfoModal
                    title="Success!"
                    text="Your ad has been published"
                  />
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
            <Map
              location={values.country}
              setFieldValue={setFieldValue}
              countries={country}
              setDisabledMap={setDisabledMap}
              disabledMap={disabledMap}
              markerCoordinate={markerCoordinate}
              setMarkerCoordinate={setMarkerCoordinate}
              selectedCountry={selectedCountry}
            />
          </div>
        </>
      )}
    </Formik>
  );
};

export default LotForm;
