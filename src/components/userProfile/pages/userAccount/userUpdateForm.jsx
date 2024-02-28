import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import _ from 'lodash';
import { updateUserAttributes } from 'aws-amplify/auth';
import { TextField, Box } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

import { updateToken, updateUser } from '@thunks/fetchUsers';
import { toggleModal } from '@slices/modalSlice';

import { CustomButton } from '@components/buttons/CustomButton';
import ConfirmCodeModal from '@customModals/confirmCodeModal';

import { updateUserValidationSchema } from '@helpers/validationSchemes/userDataValidationSchemes';

import styles from './userAccount.module.scss';

const {
  formContainer,
  buttonsContainer,
  formBtn,
  formBtnCancelHidden,
  formBtnCancelVisible,
} = styles;

const editBtnProps = {
  text: 'Edit data',
  icon: <EditOutlinedIcon />,
  type: 'secondary',
  size: 'M',
};

const saveBtnProps = {
  text: 'Save',
  icon: <CheckOutlinedIcon />,
  type: 'primary',
  size: 'M',
};

const UserUpdateForm = ({
  user: { sub, name, email, zoneinfo },
  setFormDisabled,
  isFormDisabled,
  setIsChanged,
  isChanged,
}) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState();
  
  const handleEditClick = () => {
    setFormDisabled(false);
  };

  const handleCancelClick = () => {
    formik.resetForm();
    setFormDisabled(true);
  };
  async function handleUpdateEmailAndNameAttributes(updatedEmail, updatedName) {
    try {
      const output = await updateUserAttributes({
        userAttributes: {
          email: updatedEmail,
          name: updatedName,
        },
      });

      handleUpdateUserAttributeNextSteps(output);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleUpdateUserAttributeNextSteps(output) {
    const nextStepEmail = output.email.nextStep.updateAttributeStep;
    const nextStepName = output.name.nextStep.updateAttributeStep;

    switch (nextStepEmail || nextStepName) {
      case 'CONFIRM_ATTRIBUTE_WITH_CODE':
        dispatch(toggleModal('updatingModal'));

        break;
      // case 'DONE':
      //   setIsChanged(true);
      //   dispatch(updateToken());
      //   break;
    }
  }

  const handleUpdateEmailAndNameAttributes = async (
    updatedEmail,
    updatedName
  ) => {
    try {
      const output = await updateUserAttributes({
        userAttributes: {
          email: updatedEmail,
          name: updatedName,
        },
      });

      handleUpdateUserAttributeNextSteps(output, updatedName);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateUserAttributeNextSteps = async (output, updatedName) => {
    const nextStepEmail = output.email.nextStep.updateAttributeStep;
    const nextStepName = output.name.nextStep.updateAttributeStep;

    switch (nextStepEmail || nextStepName) {
      case 'CONFIRM_ATTRIBUTE_WITH_CODE':
        dispatch(toggleModal('updatingModal'));
        break;

      case 'DONE':
        const updateDataUser = {
          email,
          zoneinfo,
          updatedName,
        };

        dispatch(updateUser({ id: sub, userData: updateDataUser }));
        dispatch(updateToken());
        break;
    }
  };

  const handleSubmit = (values) => {
    handleUpdateEmailAndNameAttributes(values.email, values.name);
    setFormDisabled(true);
  };

  const formik = useFormik({
    initialValues: {
      name: name || '',
      email: email || '',
    },
    validationSchema: updateUserValidationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <Box
      component="form"
      className={formContainer}
      onSubmit={formik.handleSubmit}
    >
      <TextField
        id="name"
        name="name"
        label="Name"
        placeholder={name}
        disabled={isFormDisabled}
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      />
      <TextField
        id="email"
        name="email"
        label="Email"
        disabled={isFormDisabled}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />
      <div className={buttonsContainer}>
        <div
          className={`${
            isFormDisabled ? formBtnCancelHidden : formBtnCancelVisible
          }`}
          onClick={handleCancelClick}
        >
          <CustomButton text="Cancel" size="M" type="secondary" width="84px" />
        </div>
        {isFormDisabled && (
          <div className={formBtn} onClick={handleEditClick}>
            <CustomButton {...editBtnProps} />
          </div>
        )}
        {!isFormDisabled && (
          <div className={formBtn}>
            <CustomButton
              {...saveBtnProps}
              typeOfButton="submit"
              disabled={!_.isEmpty(formik.errors)}
            />
          </div>
        )}
      </div>
      <ConfirmCodeModal
        setCode={setCode}
        values={formik.values}
        sub={sub}
        zoneinfo={zoneinfo}
      />
    </Box>
  );
};

export default UserUpdateForm;
