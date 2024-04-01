import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import { updateCategory } from '@thunks/fetchCategories';

import { toggleModal, setModalFields } from '@slices/modalSlice';
import { selectModalState } from '@slices/modalSlice';
import { selectCategoryById } from '@slices/categoriesSlice';

import { IMAGE_URL } from '@helpers/endpoints';
import { categoryTitleValidationSchema } from '@helpers/validationSchemes/lotValidationSchemes';
import { getFetchResultMessages } from '@helpers/getFetchResultMessages';

import CustomTextField from '@customTextField';
import CustomUploadButton from '../customUploadButton';

import bannerImage from '@assets/images/banner.png';

const { successCategoryUpdate } = getFetchResultMessages();

import styles from './infoModal.module.scss';

const ModalForUpdatingCategory = () => {
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

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

  const handleSubmitClick = async (values, { resetForm }) => {
    const formData = new FormData();
    const data = {
      id: categoryFields.id,
      title: values.title,
      parentId: categoryFields.parentId,
      image: categoryFields.image,
    };

    formData.append('file', file);
    formData.append('data', JSON.stringify(data));
    const resultAction = await dispatch(
      updateCategory({ id: categoryId, categoryData: formData })
    );

    if (!resultAction.error) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: successCategoryUpdate,
          severity: 'success',
          isOpen: true,
        })
      );
      dispatch(toggleModal('updatingModal'));
      resetForm();
    }
  };

  const closePopup = () => {
    setFile(null);
    setImageSrc(null);
    dispatch(toggleModal('updatingModal'));
  };

  useEffect(() => {
    let src = bannerImage;

    if (file) {
      src = file.preview;
    } else if (categoryFields?.image) {
      src = `${IMAGE_URL}/${categoryFields.image}`;
    }

    setImageSrc(src);
  }, [file, categoryFields]);

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={closePopup}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.wrapp}>
          <h2 className={styles.title}>Update category</h2>
          <CloseIcon className={styles.closeIcon} onClick={closePopup} />
          <Formik
            initialValues={categoryData}
            onSubmit={handleSubmitClick}
            validationSchema={categoryTitleValidationSchema}
          >
            {({ values, errors, touched, isValid, setFieldValue }) => (
              <Form>
                <CustomTextField
                  name="title"
                  placeholder="Enter the category name"
                  label="Name of category"
                  id="category"
                  value={values.title}
                  errors={errors.title}
                  touched={touched.title}
                  type="modalTextField"
                  setFieldValue={setFieldValue}
                />
                <div className={styles.buttonsWrapp}>
                  <CustomUploadButton
                    file={file}
                    setFile={setFile}
                    imageSrc={imageSrc}
                    setImageSrc={setImageSrc}
                    isValid={isValid}
                    buttonName="Update"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalForUpdatingCategory;
