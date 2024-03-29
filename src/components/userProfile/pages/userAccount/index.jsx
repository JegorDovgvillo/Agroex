import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Avatar, FormControlLabel, CircularProgress } from '@mui/material';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';

import { toggleModal } from '@slices/modalSlice';
import { deleteUserInfo } from '@slices/usersListSlice';
import { clearMessages } from '@slices/sseSlice';

import { CustomButton } from '@components/buttons/CustomButton';
import { CheckBoxInput } from '@components/checkBox';
import UpdatePasswordModal from '@customModals/updatePasswordModal';
import UpdateUserDataModal from '@customModals/updateUserDataModal';

import ROUTES from '@helpers/routeNames';

import UserUpdateForm from './userUpdateForm';
import styles from './userAccount.module.scss';

const {
  circularContainer,
  container,
  title,
  personalData,
  personalDataContainer,
  avatarContainer,
  avatar,
  checkBox,
  settings,
} = styles;

const UserAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.usersList.userInfo);

  const [isFormDisabled, setFormDisabled] = useState(true);

  if (!user) {
    return (
      <div className={circularContainer}>
        <CircularProgress />
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((el) => el.slice(0, 1))
    .join('')
    .toUpperCase();

  const handleSignOut = () => {
    signOut();
    dispatch(clearMessages());
    navigate(ROUTES.LOG_IN);
    dispatch(deleteUserInfo());
  };

  const showModalForUpdatePassword = () => {
    dispatch(toggleModal('updatingModal'));
  };

  return (
    <>
      <div className={container}>
        <div className={avatarContainer}>
          <Avatar className={avatar}>
            <h2>{initials}</h2>
          </Avatar>
          <div className={settings}>
            <p className={title}>Additional settings</p>
            <FormControlLabel
              className={checkBox}
              control={<CheckBoxInput checked={true} />}
              label="Notify me of new messages"
            />
          </div>
          <div className={settings}>
            <p className={title}>Sign out</p>
            <CustomButton
              text="Sign out"
              icon={<ExitToAppIcon />}
              type="secondary"
              size="M"
              width="198px"
              handleClick={handleSignOut}
            />
          </div>
        </div>
        <div className={personalDataContainer}>
          <div className={personalData}>
            <p className={title}>Personal data</p>
            <UserUpdateForm
              user={user}
              setFormDisabled={setFormDisabled}
              isFormDisabled={isFormDisabled}
            />
          </div>
          <div className={personalData}>
            <p className={title}>Security</p>
            <CustomButton
              text="Change password"
              icon={<HttpsOutlinedIcon />}
              type="secondary"
              size="M"
              width="198px"
              handleClick={showModalForUpdatePassword}
            />
          </div>
        </div>
      </div>
      <UpdatePasswordModal text="Update your password" />
      <UpdateUserDataModal
        text="Update your profile info"
        user={user}
        setFormDisabled={setFormDisabled}
        isFormDisabled={isFormDisabled}
      />
    </>
  );
};

export default UserAccount;
