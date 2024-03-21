import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { v4 as uuidv4 } from 'uuid';
import CloseIcon from '@mui/icons-material/Close';
import _ from 'lodash';

import { updateCategory } from '@thunks/fetchCategories';

import { toggleModal } from '@slices/modalSlice';
import { selectModalState } from '@slices/modalSlice';
import { selectCategoryById } from '@slices/categoriesSlice';

import ENDPOINTS, { IMAGE_URL } from '@helpers/endpoints';
import { categoryTitleValidationSchema } from '@helpers/validationSchemes/lotValidationSchemes';

import CustomTextField from '@customTextField';
import { CustomButton } from '@buttons/CustomButton';

import styles from './infoModal.module.scss';


const ModalForUpdatingCategory = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const [file, setFile] = useState(null);
  const [iamgeSrc, setImageSrc] = useState(null);

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

  const handleSubmitClick = (values, { resetForm }) => {
    const formData = new FormData();
    const data = {
      id: categoryFields.id,
      title: values.title,
      parentId: categoryFields.parentId,
      image: categoryFields.image,
    };

    formData.append('file', file);
    formData.append('data', JSON.stringify(data));
    dispatch(updateCategory({ id: categoryId, categoryData: formData }));

    resetForm();
  };

  const handleFileChange = (event) => {
    const newFile = event.target.files[0];

    setFile(
      _.assign(newFile, {
        preview: URL.createObjectURL(newFile),
        id: uuidv4(),
      })
    );
  };

  const closePopup = () => {
    dispatch(toggleModal('updatingModal'));
    setFile(null);
    setImageSrc(null);
  };

  const removeFile = () => {
    if (file) {
      fileInputRef.current.value = '';

      setFile(null);
      URL.revokeObjectURL(file.preview);
    }
  };

  useEffect(() => {
    if (file || (categoryFields && categoryFields.image)) {
      const src = file
        ? file.preview
        : `${IMAGE_URL}${ENDPOINTS.IMAGES}/${categoryFields.image}`;

      setImageSrc(src);
    }
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
                  type="modalTextField"
                />
                <div className={styles.buttonsWrapp}>
                  <p>Selected image:</p>
                  <img src={iamgeSrc} alt="Uploaded" />
                  <CloseIcon
                    onClick={removeFile}
                    className={styles.deleteIcon}
                  />
                  <div className={styles.buttons}>
                    <Button
                      component="label"
                      variant="contained"
                      sx={{ width: '210px' }}
                    >
                      <CloudUploadIcon />
                      <span>Upload file</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </Button>
                    <CustomButton
                      disabled={!isValid}
                      text="Update"
                      width="210px"
                      typeOfButton="submit"
                    />
                  </div>
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
