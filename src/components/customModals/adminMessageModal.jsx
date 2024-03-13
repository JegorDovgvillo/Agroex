import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';

import Modal from '@mui/material/Modal';

import { CustomButton } from '@buttons/CustomButton';
import {
  toggleModal,
  selectModalState,
  setModalFields,
  clearModalsFields,
} from '@slices/modalSlice';
import { adminMessageValidationSchema } from '@helpers/validationSchemes/adminMessageValidationSchema.js';
import CustomTextField from '@customTextField';

import styles from './adminMessageModal.module.scss';

const { modalContainer, modalContent, buttonsContainer } = styles;

const AdminMessageModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) =>
    selectModalState(state, 'adminMessageModal')
  );

  const handleClose = () => {
    dispatch(clearModalsFields(['adminMessageModal', 'confirmModal']));
  };

  const handleSubmit = (values) => {
    dispatch(
      setModalFields({
        modalId: 'adminMessageModal',
        adminMessage: values.message,
      })
    );

    dispatch(toggleModal('adminMessageModal'));
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleClose}
        className={modalContainer}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={modalContent}>
          <Formik
            initialValues={{ message: '' }}
            onSubmit={handleSubmit}
            validationSchema={adminMessageValidationSchema}
          >
            {({ values, errors, touched, isValid }) => (
              <Form>
                <CustomTextField
                  name="message"
                  placeholder="Type a message"
                  multiline
                  rows={4}
                  type="textarea"
                  label="Reject reason"
                  id="message"
                  value={values.message}
                  errors={errors.message}
                  touched={touched.message}
                />
                <div className={buttonsContainer}>
                  <CustomButton
                    text="Cancel"
                    width="100px"
                    typeOfButton="button"
                    handleClick={handleClose}
                  />
                  <CustomButton
                    text="Submit"
                    width="150px"
                    typeOfButton="submit"
                    disabled={!isValid}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
};

export default AdminMessageModal;
