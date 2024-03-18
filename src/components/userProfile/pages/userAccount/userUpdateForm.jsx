import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { TextField, Box } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { toggleModal } from '@slices/modalSlice';

import { CustomButton } from '@buttons/CustomButton';

import styles from './userAccount.module.scss';

const { formContainer } = styles;

const editBtnProps = {
  text: 'Edit data',
  icon: <EditOutlinedIcon />,
  type: 'secondary',
  size: 'M',
  width: '198px',
};

const UserUpdateForm = ({ user: { name, email, zoneinfo } }) => {
  const dispatch = useDispatch();

  const editUserData = () => {
    dispatch(toggleModal('updatingUserDataModal'));
  };

  return (
    <Box className={formContainer}>
      <TextField id="name" name="name" label="Name" disabled value={name} />
      <TextField id="email" name="email" label="Email" disabled value={email} />
      <TextField
        id="zoneinfo"
        name="zoneinfo"
        label="Zone info"
        disabled
        value={zoneinfo}
      />
      <CustomButton
        {...editBtnProps}
        handleClick={editUserData}
        typeOfButton="button"
      />
    </Box>
  );
};

export default UserUpdateForm;
