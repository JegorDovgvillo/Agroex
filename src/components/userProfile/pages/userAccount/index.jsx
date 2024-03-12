import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Avatar, FormControlLabel, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';

import { getUserFromCognito } from '@thunks/fetchUsers';

import { toggleModal } from '@slices/modalSlice';
import { deleteUserInfo } from '@slices/usersListSlice';

import { CustomButton } from '@components/buttons/CustomButton';
import { CheckBoxInput } from '@components/checkBox';
import UpdatePasswordModal from '@customModals/updatePasswordModal';

import ROUTES from '@helpers/routeNames';

import UserUpdateForm from './userUpdateForm';
import styles from './userAccount.module.scss';

const {
  circularContainer,
  container,
  title,
  personalDataContainer,
  personalData,
  security,
  avatarContainer,
  avatar,
  editIcon,
  editPhotoBtn,
  checkBox,
} = styles;

const UserAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.usersList.userInfo);

  const [isFormDisabled, setFormDisabled] = useState(true);

  useEffect(() => {
    dispatch(getUserFromCognito());
  }, []);

  if (!user) {
    return (
      <div className={circularContainer}>
        <CircularProgress />
      </div>
    );
  }

  const handlePhotoEdit = () => {
    //todo write upload user photo logic
  };

  const initials = user.name
    .split(' ')
    .map((el) => el.slice(0, 1))
    .join('')
    .toUpperCase();

  const handleSignOut = () => {
    signOut();
    navigate(ROUTES.LOG_IN);
    dispatch(deleteUserInfo());
  };

  const showModalForUpdatePassword = () => {
    dispatch(toggleModal('updatingModal'));
  };

  return (
    <>
      <div className={container}>
        <div className={personalDataContainer}>
          <p className={title}>Personal data</p>
          <div className={personalData}>
            <div className={avatarContainer}>
              <Avatar className={avatar}>
                <h2>{initials}</h2>
              </Avatar>
              {!isFormDisabled && (
                <Avatar onClick={handlePhotoEdit} className={editPhotoBtn}>
                  <EditIcon className={editIcon} />
                </Avatar>
              )}
            </div>
            <div>
              <div>
                <UserUpdateForm
                  user={user}
                  setFormDisabled={setFormDisabled}
                  isFormDisabled={isFormDisabled}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={security}>
          <p className={title}>Security</p>
          <CustomButton
            text="Change password"
            icon={<HttpsOutlinedIcon />}
            type="secondary"
            size="M"
            width="198px"
            handleClick={showModalForUpdatePassword}
          />
          <CustomButton
            text="Sign out"
            icon={<ExitToAppIcon />}
            type="secondary"
            size="M"
            width="125px"
            handleClick={handleSignOut}
          />
        </div>
        <div className={security}>
          <p className={title}>Additional settings</p>
          <div>
            <FormControlLabel
              className={checkBox}
              control={<CheckBoxInput checked={true} />}
              label="Notify me of new messages"
            />
          </div>
        </div>
      </div>
      <UpdatePasswordModal text="Update your password" />
    </>
  );
};

export default UserAccount;
