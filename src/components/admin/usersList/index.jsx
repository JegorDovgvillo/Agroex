import { useEffect } from 'react';
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
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

import { fetchUsers } from '@store/thunks/fetchUsers';
import { usersListSelector } from '@store/slices/usersListSlice';
import getFormattedDate from '@helpers/getFormattedDate';

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
} = styles;

export default function UsersList() {
  const dispatch = useDispatch();
  const users = useSelector(usersListSelector);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEditClick = () => {
    //toDo write edit user logic
  };

  const handleDeleteClick = () => {
    //toDo write edit user logic
  };

  return (
    <>
      <Typography component='h2' variant='h6' color='primary' gutterBottom>
        Users
      </Typography>
      <Table size='small'>
        <TableHead>
          <TableRow className={tableRow}>
            <TableCell>ID</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Registration Date</TableCell>
            <TableCell>Email Verified</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users &&
            users.map((u) => (
              <TableRow key={u.id} className={tableRow}>
                <TableCell>{u.id}</TableCell>
                <TableCell>
                  <span className={userName} onClick={handleEditClick}>
                    {u.username}
                  </span>
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phoneNumber}</TableCell>
                <TableCell>{getFormattedDate(u.creationDate)}</TableCell>
                <TableCell className={verifiedIconContainer}>
                  <>
                    {u.emailVerified && (
                      <VerifiedUserIcon className={verifiedIcon} />
                    )}
                    {!u.emailVerified && (
                      <GppBadIcon className={noVerifiedIcon} />
                    )}
                  </>
                </TableCell>
                <TableCell>
                  <div className={editBlock}>
                    <DeleteForeverOutlinedIcon
                      className={deleteIcon}
                      onClick={handleDeleteClick}
                    />
                    <BorderColorIcon
                      className={editIcon}
                      onClick={handleEditClick}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}
