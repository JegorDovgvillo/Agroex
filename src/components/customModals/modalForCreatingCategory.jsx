import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Modal } from '@mui/material';
import { Formik, Form } from 'formik';

import { toggleModal, selectModalState } from '@slices/modalSlice';
import { createCategory, fetchSubcategories } from '@thunks/fetchCategories';

import {
  selectRootCategories,
  selectCategoryByParentId,
} from '@slices/categoriesSlice';

import {
  categoryTitleValidationSchema,
  subcategoryCreationValidationSchema,
} from '@helpers/validationSchemes/lotValidationSchemes';

import CustomSelect from '../customSelect';
import { CustomButton } from '@buttons/CustomButton';

import styles from './infoModal.module.scss';
import CustomAutocompleteField from '../customAutocomplete';

const ModalForCreatingCategory = () => {
  const dispatch = useDispatch();

  const initialValues = {
    title: '',
    parentId: '',
  };

  const isOpen = useSelector((state) =>
    selectModalState(state, 'creatingModal')
  );
  const rootCategories = useSelector(selectRootCategories);
  const [isCreatingCategory, setIsCreatingCategory] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialValues.parentId
  );

  const handleSubmit = (values) => {
    dispatch(createCategory(values));
    dispatch(toggleModal('creatingModal'));
  };

  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(fetchSubcategories(selectedCategoryId));
    }
  }, [selectedCategoryId]);

  const subcategories = useSelector((state) =>
    selectCategoryByParentId(state, selectedCategoryId)
  );

  const handleCategorySelect = (value) => {
    setSelectedCategoryId(value);
  };

  return (
    <div>
      <Modal
        open={isOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={() => {
          dispatch(toggleModal('creatingModal'));
        }}
      >
        <Box className={styles.wrapp}>
          <h2 className={styles.title}>
            {isCreatingCategory
              ? 'Create new Category'
              : 'Create new subcategory'}
          </h2>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
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
                    width="210px"
                    disabled={false}
                    margin="0 16px 24px 0"
                    placeholder="Choose category"
                    label="Category"
                    value={values.parentId}
                    errors={errors.parentId}
                    touched={touched.parentId}
                    handleChange={(value) => handleCategorySelect(value)}
                    setFieldValue={setFieldValue}
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
                />

                <CustomButton
                  text="Create"
                  width="210px"
                  typeOfButton="submit"
                  disabled={!isValid}
                />
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
