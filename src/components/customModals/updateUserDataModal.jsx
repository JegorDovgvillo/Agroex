import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import _ from 'lodash';
import { updateUserAttributes, signOut } from 'aws-amplify/auth';
import { TextField, Box, Modal, Autocomplete } from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

import { updateToken, updateUser } from '@thunks/fetchUsers';

import {
  toggleModal,
  selectModalState,
  setModalFields,
} from '@slices/modalSlice';
import { deleteUserInfo } from '@slices/usersListSlice';

import { CustomButton } from '@components/buttons/CustomButton';
import ConfirmCodeModal from '@customModals/confirmCodeModal';

import { updateUserValidationSchema } from '@helpers/validationSchemes/userDataValidationSchemes';
import { getFetchResultMessages } from '@helpers/getFetchResultMessages';
import ROUTES from '@helpers/routeNames';

import timeZones from '../../data/timeZones';

import styles from './infoModal.module.scss';

const { successUpdateUserData, updateUserDataWarning, authError } =
  getFetchResultMessages();
const { LOG_IN } = ROUTES;

const {
  wrapp,
  title,
  formContainer,
  buttonsContainer,
  formBtn,
  formBtnCancelVisible,
} = styles;

const saveBtnProps = {
  text: 'Save',
  icon: <CheckOutlinedIcon />,
  type: 'primary',
  size: 'M',
  width: '180px',
};

const UpdateUserDataModal = ({
  user: { sub, name, email, zoneinfo },
  text,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [code, setCode] = useState();

  const isOpen = useSelector((state) =>
    selectModalState(state, 'updatingUserDataModal')
  );

  const handleCancelClick = () => {
    formik.resetForm();
    dispatch(toggleModal('updatingUserDataModal'));
  };

  const handleUpdateEmailAndNameAttributes = async (
    updatedEmail,
    updatedName,
    updatedZone
  ) => {
    try {
      const output = await updateUserAttributes({
        userAttributes: {
          email: updatedEmail,
          name: updatedName,
          zoneinfo: updatedZone,
        },
      });

      handleUpdateUserAttributeNextSteps(output, updatedName, updatedZone);
    } catch (error) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: error.message,
          severity: 'error',
          isOpen: true,
          hideDuration: null,
        })
      );
    }
  };

  const handleSignOut = () => {
    navigate(LOG_IN);
    signOut();
    dispatch(deleteUserInfo());
  };

  const handleUpdateUserAttributeNextSteps = async (
    output,
    updatedName,
    updatedZone
  ) => {
    const nextStepEmail = output.email.nextStep.updateAttributeStep;
    const nextStepName = output.name.nextStep.updateAttributeStep;

    switch (nextStepEmail || nextStepName) {
      case 'CONFIRM_ATTRIBUTE_WITH_CODE':
        dispatch(toggleModal('codeModal'));
        break;

      case 'DONE':
        const updateDataUser = {
          email,
          zoneinfo: updatedZone,
          username: updatedName,
        };

        const resultUserUpdate = await dispatch(
          updateUser({ id: sub, userData: updateDataUser })
        );
        dispatch(toggleModal('updatingUserDataModal'));
        const resultTokenUpdate = await dispatch(updateToken());
        console.log(resultTokenUpdate);
        if (resultTokenUpdate.error) {
          dispatch(
            setModalFields({
              modalId: 'snackbar',
              message: authError,
              severity: 'error',
              isOpen: true,
              hideDuration: null,
            })
          );
          handleSignOut();
        }

        if (resultUserUpdate.error) {
          dispatch(
            setModalFields({
              modalId: 'snackbar',
              message: `${successUpdateUserData}${updateUserDataWarning}`,
              severity: 'warning',
              isOpen: true,
              hideDuration: null,
            })
          );
        }

        if (!resultUserUpdate.error && !resultTokenUpdate.error) {
          dispatch(
            setModalFields({
              modalId: 'snackbar',
              message: successUpdateUserData,
              severity: 'success',
              isOpen: true,
              hideDuration: null,
            })
          );
        }
        break;
    }
  };

  const handleSubmit = (values) => {
    handleUpdateEmailAndNameAttributes(
      values.email,
      values.name,
      values.zoneinfo
    );
  };

  const filteredTimeZone = _.filter(timeZones, { value: zoneinfo });

  const formik = useFormik({
    initialValues: {
      name: name || '',
      email: email || '',
      zoneinfo: zoneinfo || '',
    },
    validationSchema: updateUserValidationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        dispatch(toggleModal('updatingUserDataModal'));
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        component="form"
        className={`${formContainer} ${wrapp}`}
        onSubmit={formik.handleSubmit}
      >
        <h3 className={title}>{text}</h3>
        <TextField
          id="name"
          name="name"
          label="Name"
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
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <Autocomplete
          id="zoneinfo"
          disablePortal
          defaultValue={filteredTimeZone[0]}
          options={timeZones}
          sx={{ width: 300 }}
          onChange={(event, newValue) => {
            formik.setFieldValue('zoneinfo', newValue.value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Zone info"
              name="zoneinfo"
              value={formik.values.zoneinfo}
            />
          )}
        />
        <div className={buttonsContainer}>
          <div className={formBtnCancelVisible} onClick={handleCancelClick}>
            <CustomButton
              text="Cancel"
              size="M"
              type="secondary"
              width="180px"
            />
          </div>
          <div className={formBtn}>
            <CustomButton
              {...saveBtnProps}
              typeOfButton="submit"
              disabled={!_.isEmpty(formik.errors)}
            />
          </div>
        </div>
        <ConfirmCodeModal
          setCode={setCode}
          values={formik.values}
          sub={sub}
          zoneinfo={zoneinfo}
          resetForm={formik.resetForm}
        />
      </Box>
    </Modal>
  );
};

export default UpdateUserDataModal;
