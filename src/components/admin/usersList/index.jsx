import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GppBadIcon from '@mui/icons-material/GppBad';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import {
  fetchUsers,
  changeUserStatus,
  updateUsersInTheDataBase,
} from '@thunks/fetchUsers';

import { setUserId, usersListSelector } from '@slices/usersListSlice';
import { toggleModal } from '@slices/modalSlice';

import getFormattedDate from '@helpers/getFormattedDate';

import ConfirmActionModal from '@customModals/confirmActionModal';

import styles from './usersList.module.scss';

const {
  verifiedIcon,
  noVerifiedIcon,
  verifiedIconContainer,
  tableRow,
  editIcon,
  editBlock,
  titleWrapp,
  enabled,
  disabled,
  updateDB,
} = styles;

export default function UsersList() {
  const dispatch = useDispatch();

  const users = useSelector(usersListSelector);
  const userId = useSelector((state) => state.usersList.userId);

  const [confirmStatus, setConfirmStatus] = useState(false);
  const [confirmUpdateDB, setConfirmUpdateDB] = useState(false);
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (confirmStatus) {
      dispatch(changeUserStatus({ id: userId }));
      setConfirmStatus(false);
    } else if (confirmUpdateDB) {
      dispatch(updateUsersInTheDataBase());
      setConfirmUpdateDB(false);
    }
  }, [confirmStatus, confirmUpdateDB]);

  const toggleUserStatus = (id) => {
    dispatch(setUserId(id));
    dispatch(toggleModal('confirmModal'));
  };

  const updateUsersInDB = () => {
    dispatch(toggleModal('infoModal'));
  };

  return (
    <>
      <div className={titleWrapp}>
        <Typography component="h2" variant="h6" color="primary">
          Users
        </Typography>
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          className={updateDB}
          onClick={updateUsersInDB}
        >
          Update users in the DB
          <CloudDownloadIcon />
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
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.creationDate && getFormattedDate(user.creationDate)}
                </TableCell>
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
                    <PowerSettingsNewIcon
                      className={`${editIcon}
                        ${user.enabled ? enabled : disabled}`}
                      onClick={() => toggleUserStatus(user.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <ConfirmActionModal
        text="This action change the user status. Do you confirm the action?"
        setConfirmStatus={setConfirmStatus}
      />
      <ConfirmActionModal
        text="This action updates the user database. Do you confirm the action?"
        setConfirmStatus={setConfirmUpdateDB}
        modalType="infoModal"
      />
    </>
  );
}
