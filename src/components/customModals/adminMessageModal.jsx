import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { CustomButton } from '@buttons/CustomButton';

import { toggleModal } from '@slices/modalSlice';
import { selectModalState } from '@slices/modalSlice';

import CustomTextField from '@customTextField';
import { adminMessageValidationSchema } from '@helpers/validationSchemes/adminMessageValidationSchema.js';

import styles from './adminMessageModal.module.scss';

const { modalContainer, modalContent, buttonsContainer } = styles;

const AdminMessageModal = ({ setAdminMessage }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) =>
    selectModalState(state, 'adminMessageModal')
  );

  const handleClose = () => {
    dispatch(toggleModal('adminMessageModal'));
  };

  const handleSubmit = (values) => {
    setAdminMessage(values.message);
    dispatch(toggleModal('adminMessageModal'));
  };

  const adminCommentData = {
    message: '',
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
            initialValues={adminCommentData}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
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
                    onClick={handleClose}
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
