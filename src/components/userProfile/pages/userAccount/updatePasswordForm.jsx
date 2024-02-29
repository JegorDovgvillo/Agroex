import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { updatePassword } from 'aws-amplify/auth';
import { Box, TextField } from '@mui/material';

import { toggleModal } from '@slices/modalSlice';

import { CustomButton } from '@components/buttons/CustomButton';

import ConfirmActionModal from '@customModals/confirmActionModal';
import CustomPasswordField from '@components/customPasswordField';
import { createUserValidationSchema } from '@helpers/validationSchemes/userDataValidationSchemes';

import styles from './userAccount.module.scss';

const { formContainer, passwordsBlock, buttonsWrapp } = styles;

const UpdatePasswordForm = ({ setIsChanged }) => {
  const dispatch = useDispatch();
  const [confirmStatus, setConfirmStatus] = useState(false);
  
  useEffect(() => {
    if (confirmStatus) {
      setConfirmStatus(false);
      handleUpdatePassword(
        formik.values.oldPassword,
        formik.values.newPassword
      );
    }
  }, [confirmStatus]);

  const handleCancelClick = () => {
    formik.resetForm();
    setIsChanged(false);
  };

  const handleUpdatePassword = async (oldPassword, newPassword) => {
    try {
      await updatePassword({
        oldPassword,
        newPassword,
      });
      
      setIsChanged(false);
    } catch (error) {
      console.log(error);
    }
  };

  const showConfirm = () => {
    dispatch(toggleModal('confirmModal'));
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
    },
    validationSchema: createUserValidationSchema,
    onSubmit: showConfirm,
  });

  return (
    <Box
      component="form"
      className={formContainer}
      onSubmit={formik.handleSubmit}
    >
      <div className={passwordsBlock}>
        <CustomPasswordField
          id="oldPassword"
          value={formik.values.oldPassword}
          handleChange={formik.handleChange}
          width="316px"
          label="Old password"
          name="oldPassword"
          onBlur={formik.handleBlur}
          error={Boolean(formik.errors.oldPassword)}
          helperText={formik.touched.oldPassword && formik.errors.oldPassword}
        />
        <CustomPasswordField
          label="New password"
          value={formik.values.newPassword}
          handleChange={formik.handleChange}
          width="316px"
          name="newPassword"
          id="newPassword"
          onBlur={formik.handleBlur}
          error={Boolean(formik.errors.newPassword)}
          helperText={formik.touched.newPassword && formik.errors.newPassword}
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
      <ConfirmActionModal
        text="This action change the password. Do you confirm the action?"
        setConfirmStatus={setConfirmStatus}
      />
    </Box>
  );
};

export default UpdatePasswordForm;
