import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';

import { TextField, Box } from '@mui/material';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

import { updateUser } from '@thunks/fetchUsers';
import { CustomButton } from '@components/buttons/CustomButton';

import styles from './userAccount.module.scss';

const {
  formContainer,
  input,
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

const UserUpdateForm = ({ user, setFormDisabled, isFormDisabled }) => {
  const dispatch = useDispatch();

  const { id, username, email, phoneNumber } = user;

  const handleEditClick = () => {
    setFormDisabled(false);
  };

  const handleCancelClick = () => {
    formik.resetForm();
    setFormDisabled(true);
  };

  const formik = useFormik({
    initialValues: {
      username: username || '',
      email: email || '',
      phoneNumber: phoneNumber || '',
    },

    onSubmit: (values) => {
      dispatch(updateUser({ id: id, userData: values }));
      setFormDisabled(true);
    },
  });

  return (
    <Box
      component="form"
      className={formContainer}
      onSubmit={formik.handleSubmit}
    >
      <TextField
        id="username"
        name="username"
        className={input}
        label="Name"
        placeholder={username}
        disabled={isFormDisabled}
        value={formik.values.username}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <TextField
        id="email"
        name="email"
        label="Email"
        disabled={true}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      <TextField
        id="phoneNumber"
        name="phoneNumber"
        label="Phone"
        value={formik.values.phoneNumber}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={isFormDisabled}
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
            <CustomButton {...saveBtnProps} typeOfButton="submit" />
          </div>
        )}
      </div>
    </Box>
  );
};

export default UserUpdateForm;
