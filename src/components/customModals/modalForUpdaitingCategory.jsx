import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';

import { toggleModal } from '@slices/modalSlice';
import { selectModalState } from '@slices/modalSlice';
import { updateCategory } from '@thunks/fetchCategories';
import { selectCategoryById } from '@slices/categoriesSlice';

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
    title: categoryFields?.title || '',
  };

  const handleSubmitClick = (values) => {
    dispatch(updateCategory({ id: categoryId, categoryData: values }));
    dispatch(toggleModal('updatingModal'));
  };

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
          >
            <Form>
              <CustomTextField
                name="title"
                placeholder="Enter the category name"
                required
                label="Name of category"
                id="title"
              />
              <CustomButton text="Update" width="210px" typeOfButton="submit" />
            </Form>
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalForUpdatingCategory;
