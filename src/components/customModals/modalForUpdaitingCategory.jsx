import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';

import { toggleModal } from '@slices/modalSlice';
import { selectModalState } from '@slices/modalSlice';
import { updateCategory } from '@thunks/fetchCategories';
import { selectCategoryById } from '@slices/categoriesSlice';

import { categoryTitleValidationSchema } from '@helpers/validationSchemes/lotValidationSchemes';

import CustomTextField from '@customTextField';
import { CustomButton } from '@buttons/CustomButton';

import styles from './infoModal.module.scss';

const ModalForUpdatingCategory = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) =>
    selectModalState(state, 'updatingModal')
  );
  const categoryId = useSelector((state) => state.categories.categoryId);
  const categoryFields = useSelector((state) =>
    selectCategoryById(state, categoryId)
  );

  const categoryData = {
    id: categoryFields?.id || '',
    title: categoryFields?.title || '',
    parentId: categoryFields?.parentId || '',
  };

  const handleSubmitClick = (values) => {
    dispatch(updateCategory({ id: categoryId, categoryData: values }));
    dispatch(toggleModal('updatingModal'));
  };
  console.log('5', categoryData);
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => {
          dispatch(toggleModal('updatingModal'));
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.wrapp}>
          <h2 className={styles.title}>Update category</h2>
          <Formik
            initialValues={categoryData}
            onSubmit={async (values) => {
              handleSubmitClick(values);
            }}
            validationSchema={categoryTitleValidationSchema}
          >
            {({ values, errors, touched, isValid }) => (
              <Form>
                <CustomTextField
                  name="title"
                  placeholder="Enter the category name"
                  label="Name of category"
                  id="category"
                  value={values.title}
                  errors={errors.title}
                  touched={touched.title}
                />
                <CustomButton
                  disabled={!isValid}
                  text="Update"
                  width="210px"
                  typeOfButton="submit"
                />
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalForUpdatingCategory;
