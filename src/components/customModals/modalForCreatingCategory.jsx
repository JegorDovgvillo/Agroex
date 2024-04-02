import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Modal } from '@mui/material';
import { Formik, Form } from 'formik';
import CloseIcon from '@mui/icons-material/Close';

import { toggleModal, selectModalState } from '@slices/modalSlice';
import { fetchSubcategoryByParentId } from '@thunks/fetchCategories';

import {
  selectRootCategories,
  selectCategoryByParentId,
} from '@slices/categoriesSlice';

import {
  categoryTitleValidationSchema,
  subcategoryCreationValidationSchema,
} from '@helpers/validationSchemes/lotValidationSchemes';
import { useCreateCategory } from '@helpers/customHooks/categoriesHooks';

import CustomSelect from '../customSelect';
import CustomAutocompleteField from '../customAutocomplete';
import CustomUploadButton from '../customUploadButton';

import styles from './infoModal.module.scss';

const ModalForCreatingCategory = () => {
  const dispatch = useDispatch();
  const createCategory = useCreateCategory();

  const initialValues = {
    title: '',
    parentId: '',
  };

  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialValues.parentId
  );
  const rootCategories = useSelector(selectRootCategories);
  const subcategories = useSelector((state) =>
    selectCategoryByParentId(state, selectedCategoryId)
  );
  const isOpen = useSelector((state) =>
    selectModalState(state, 'creatingModal')
  );

  const handleSubmit = async (values, { resetForm }) => {
    if (!file) return;

    const formData = new FormData();
    const data = {
      parentId: values.parentId ? values.parentId : 0,
      title: values.title,
    };

    formData.append('file', file);
    formData.append('data', JSON.stringify(data));

    const resultAction = await createCategory({ dataCategory: formData });

    if (resultAction) {
      dispatch(toggleModal('creatingModal'));
      setFile(null);
      setImageSrc(null);
      resetForm();
    }
  };

  const closePopup = () => {
    setFile(null);
    setImageSrc(null);
    dispatch(toggleModal('creatingModal'));
  };

  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(fetchSubcategoryByParentId(selectedCategoryId));
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (file) {
      const src = file.preview;

      setImageSrc(src);
    } else {
      setImageSrc(null);
    }
  }, [file]);

  return (
    <div>
      <Modal
        open={isOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={closePopup}
      >
        <Box className={styles.wrapp}>
          <h2 className={styles.title}>
            <CloseIcon className={styles.closeIcon} onClick={closePopup} />
            {isCreatingCategory
              ? 'Create new Category'
              : 'Create new subcategory'}
          </h2>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={
              isCreatingCategory
                ? categoryTitleValidationSchema
                : subcategoryCreationValidationSchema
            }
          >
            {({ values, errors, touched, isValid, setFieldValue }) => (
              <Form>
                {!isCreatingCategory && (
                  <CustomSelect
                    units={rootCategories}
                    itemFieldName="title"
                    name="parentId"
                    width="100%"
                    disabled={false}
                    margin="0 16px 24px 0"
                    placeholder="Choose category"
                    label="Category"
                    value={values.parentId}
                    errors={errors.parentId}
                    touched={touched.parentId}
                    handleChange={setSelectedCategoryId}
                    setFieldValue={setFieldValue}
                    fieldType="modalTextField"
                  />
                )}
                <CustomAutocompleteField
                  name="title"
                  placeholder={
                    isCreatingCategory
                      ? 'Enter the category name'
                      : 'Enter the subcategory'
                  }
                  required
                  label={
                    isCreatingCategory ? 'Category name' : 'Subcategory name'
                  }
                  id="title"
                  value={values.title}
                  errors={errors.title}
                  touched={touched.title}
                  setFieldValue={setFieldValue}
                  options={subcategories}
                  type="modalTextField"
                  fieldType="modalTextField"
                />
                <div className={styles.buttonsWrapp}>
                  <CustomUploadButton
                    file={file}
                    setFile={setFile}
                    imageSrc={imageSrc}
                    setImageSrc={setImageSrc}
                    isValid={isValid && file}
                    buttonName="Create"
                  />
                </div>
              </Form>
            )}
          </Formik>
          <div className={styles.radioButtons}>
            <label>
              <input
                type="radio"
                value="category"
                checked={isCreatingCategory}
                onChange={() => setIsCreatingCategory(true)}
              />
              Create Category
            </label>
            <label>
              <input
                type="radio"
                value="subcategory"
                checked={!isCreatingCategory}
                onChange={() => setIsCreatingCategory(false)}
              />
              Create Subcategory
            </label>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalForCreatingCategory;
