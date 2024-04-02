import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { updatePassword } from 'aws-amplify/auth';

import { toggleModal } from '@slices/modalSlice';
import {
  selectModalState,
  selectModal,
  setModalFields,
  clearModalsFields,
} from '@slices/modalSlice';

import CustomPasswordField from '@components/customPasswordField';
import { CustomButton } from '@buttons/CustomButton';

import { userPasswordsValidationSchema } from '@helpers/validationSchemes/userDataValidationSchemes';
import { getFetchResultMessages } from '@helpers/getFetchResultMessages';

import styles from './infoModal.module.scss';

const { successPasswordUpdate } = getFetchResultMessages();
const { passwordsBlock, buttonsWrapp, wrapp, title } = styles;

const UpdatePasswordModal = ({ text }) => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state) =>
    selectModalState(state, 'updatingModal')
  );
  const confirmModalData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );

  useEffect(() => {
    if (confirmModalData.confirmStatus) {
      dispatch(clearModalsFields('confirmModal'));
      handleUpdatePassword(
        formik.values.oldPassword,
        formik.values.newPassword
      );

      dispatch(toggleModal('updatingModal'));
      formik.resetForm();
    }
  }, [confirmModalData]);

  const handleCancelClick = () => {
    formik.resetForm();
    dispatch(toggleModal('updatingModal'));
  };

  const handleUpdatePassword = async (oldPassword, newPassword) => {
    try {
      const resultPasswordUpdate = await updatePassword({
        oldPassword,
        newPassword,
      });

      if (!resultPasswordUpdate?.error) {
        dispatch(
          setModalFields({
            modalId: 'snackbar',
            message: successPasswordUpdate,
            severity: 'success',
            isOpen: true,
            hideDuration: null,
          })
        );
      }
    } catch (error) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: error?.message,
          severity: 'error',
          isOpen: true,
          hideDuration: null,
        })
      );
    }
  };

  const showConfirm = () => {
    dispatch(
      setModalFields({
        modalId: 'confirmModal',
        text: 'This action change the password. Do you confirm the action?',
      })
    );
    dispatch(toggleModal('confirmModal'));
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      retryPassword: '',
    },
    validationSchema: userPasswordsValidationSchema,
    onSubmit: showConfirm,
  });

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
        <Box component="form" className={wrapp} onSubmit={formik.handleSubmit}>
          <h3 className={title}>{text}</h3>
          <div className={passwordsBlock}>
            <CustomPasswordField
              id="oldPassword"
              value={formik.values.oldPassword}
              handleChange={formik.handleChange}
              width="316px"
              label="Old password"
              name="oldPassword"
              onBlur={formik.handleBlur}
              error={
                formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
              }
              helperText={
                formik.touched.oldPassword && formik.errors.oldPassword
              }
            />
            <CustomPasswordField
              label="New password"
              value={formik.values.newPassword}
              handleChange={formik.handleChange}
              width="316px"
              name="newPassword"
              id="newPassword"
              onBlur={formik.handleBlur}
              error={
                formik.touched.newPassword && Boolean(formik.errors.newPassword)
              }
              helperText={
                formik.touched.newPassword && formik.errors.newPassword
              }
            />
            <CustomPasswordField
              label="Retry password"
              value={formik.values.retryPassword}
              handleChange={formik.handleChange}
              width="316px"
              name="retryPassword"
              id="retryPassword"
              onBlur={formik.handleBlur}
              error={
                formik.touched.retryPassword &&
                Boolean(formik.errors.retryPassword)
              }
              helperText={
                formik.touched.retryPassword && formik.errors.retryPassword
              }
            />
            <div className={buttonsWrapp}>
              <CustomButton
                text="Confirm"
                type="secondary"
                size="M"
                typeOfButton="submit"
              />
              <CustomButton
                text="Cancel"
                type="secondary"
                size="M"
                handleClick={handleCancelClick}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdatePasswordModal;
