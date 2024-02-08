import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchUsers } from '@thunks/fetchUsers';

import { Avatar, FormControlLabel } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';

import { selectUserById } from '@slices/usersListSlice';
import { CustomButton } from '@components/buttons/CustomButton';
import { CheckBoxInput } from '@components/checkBox';

import UserUpdateForm from './userUpdateForm';

import styles from './userAccount.module.scss';

const {
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
  const user = useSelector((state) => selectUserById(state, 1));

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const [isFormDisabled, setFormDisabled] = useState(true);

  if (!user) {
    return;
  }
  const { username } = user;

  const handlePhotoEdit = () => {
    //todo write upload user photo logic
  };

  const handleChangePassword = () => {
    //todo write change password logic
  };

  const initials = username
    .split(' ')
    .map((el) => el.slice(0, 1))
    .join('')
    .toUpperCase();

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
            onClick={handleChangePassword}
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
    </>
  );
};

export default UserAccount;
