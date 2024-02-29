import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GppBadIcon from '@mui/icons-material/GppBad';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

import { setUserId, usersListSelector } from '@slices/usersListSlice';
import { fetchUsers, deleteUser } from '@thunks/fetchUsers';
import { toggleModal } from '@slices/modalSlice';
import getFormattedDate from '@helpers/getFormattedDate';

import ConfirmActionModal from '@customModals/confirmActionModal';
import ModalForCreatingUser from '@customModals/modalForCreatingUser';
import ModalForUpdatingUser from '@customModals/modalForUpdatingUser';

import styles from './usersList.module.scss';

const {
  verifiedIcon,
  noVerifiedIcon,
  verifiedIconContainer,
  tableRow,
  userName,
  editIcon,
  deleteIcon,
  editBlock,
  titleWrapp,
  title,
} = styles;

export default function UsersList() {
  const dispatch = useDispatch();
  const users = useSelector(usersListSelector);
  const userId = useSelector((state) => state.usersList.userId);
  const [confirmStatus, setConfirmStatus] = useState(false);
  console.log(users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEditClick = (id) => {
    dispatch(toggleModal('updatingModal'));
    dispatch(setUserId(id));
  };

  useEffect(() => {
    if (confirmStatus) {
      dispatch(deleteUser({ id: userId }));
      setConfirmStatus(false);
    }
  }, [confirmStatus]);

  return (
    <>
      <div className={titleWrapp}>
        <Typography component="h2" variant="h6" color="primary">
          Users
        </Typography>
      </div>
      <Table size="small">
        <TableHead>
          <TableRow className={tableRow}>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Registration Date</TableCell>
            <TableCell>Email Verified</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users &&
            users.map((user) => (
              <TableRow key={user.id} className={tableRow}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <span
                    className={userName}
                    onClick={() => handleEditClick(user.id)}
                  >
                    {user.username}
                  </span>
                </TableCell>
                <TableCell>{user.email}</TableCell>

                <TableCell>{getFormattedDate(user.creationDate)}</TableCell>
                <TableCell className={verifiedIconContainer}>
                  <>
                    {user.emailVerified && (
                      <VerifiedUserIcon className={verifiedIcon} />
                    )}
                    {!user.emailVerified && (
                      <GppBadIcon className={noVerifiedIcon} />
                    )}
                  </>
                </TableCell>
                <TableCell>
                  <div className={editBlock}>
                    {/* <DeleteForeverOutlinedIcon
                      className={deleteIcon}
                      onClick={() => showConfirm(user.id)}
                    /> */}
                    <PowerSettingsNewIcon
                      className={editIcon}
                      onClick={() => handleEditClick(user.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <ModalForUpdatingUser title="Update user info" />
      <ModalForCreatingUser title="Create new user" />
      <ConfirmActionModal
        text="This action delete the user. Do you confirm the action?"
        setConfirmStatus={setConfirmStatus}
      />
    </>
  );
}
