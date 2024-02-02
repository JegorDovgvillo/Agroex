import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Avatar from '@mui/material/Avatar';

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { fetchLots } from '@store/thunks/fetchLots';
import { fetchUsers } from '@store/thunks/fetchUsers';
import { openModal } from '@store/slices/modalSlice';
import { usersListSelector } from '@store/slices/usersListSlice';
import { lotListSelector } from '@store/slices/lotListSlice';
import getFormattedDate from '@helpers/getFormattedDate';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import getNumberWithCurrency from '../../../helpers/getNumberWithCurrency';
import CustomDialog from '../customDialog';
import AdminDetailedLotView from '../adminDetailedLotView';

import image from '../../../assets/images/77d4dc59-3013-41aa-8a7b-cb27cb6fa425.jpg';

import styles from './adminLotsList.module.scss';
import tableStyles from '../usersList/usersList.module.scss';

const { lotImage, lotTitleBlock } = styles;
const { tableRow, userName, editIcon, deleteIcon, editBlock } = tableStyles;

export default function AdminLotsList() {
  const dispatch = useDispatch();
  const lots = useSelector(lotListSelector);
  const users = useSelector(usersListSelector);
  /* const usersMap = new Map(users.map((user) => [user.id, user])); */

  useEffect(() => {
    dispatch(fetchLots());
    dispatch(fetchUsers());
  }, [dispatch]);

  /*  const findUserById = useMemo(() => {
    return (userId) => usersMap.get(userId);
  }, [usersMap]); */

  const [openedLot, setOpenedLot] = useState(null);

  /*  const userData = useCallback((userId) => {
    return users.find((user) => userId === user.id);
  }); */

  const handleEditClick = (lot) => {
    dispatch(openModal());
    setOpenedLot(lot);
  };

  const handleDeactivateClick = () => {
    //toDo write edit user logic
  };

  const dialogButtonsText = {
    first: 'Close',
    second: 'Deactivate lot',
  };

  return (
    <>
      <h6>Lots</h6>
      <Table size='small'>
        <TableHead>
          <TableRow className={tableRow}>
            <TableCell>ID</TableCell>

            <TableCell>Title</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price per/ton</TableCell>
            <TableCell>Creation Date</TableCell>
            <TableCell>Expiration Date</TableCell>
            <TableCell>Lot Type</TableCell>
            <TableCell>Price/Bet</TableCell>
            <TableCell>Bet status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users &&
            lots.map((lot) => (
              <TableRow key={lot.id} className={tableRow}>
                <TableCell>{lot.id}</TableCell>

                <TableCell>
                  <div className={lotTitleBlock}>
                    <Avatar
                      className={lotImage}
                      alt='Lot image'
                      src={image}
                      variant='rounded'
                    />
                    <span
                      className={userName}
                      onClick={() => handleEditClick(lot)}
                    >
                      {lot.title.length > 20
                        ? `${lot.title.substr(0, 20)}...`
                        : lot.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{`${getNumberWithCurrency(
                  lot.quantity
                )} ton`}</TableCell>
                <TableCell>
                  {getNumberWithCurrency(lot.pricePerTon, lot.currency)}
                </TableCell>

                <TableCell>{getFormattedDate(lot.creationDate)}</TableCell>
                <TableCell>{getFormattedDate(lot.expirationDate)}</TableCell>
                <TableCell>{lot.lotType}</TableCell>
                <TableCell>
                  {
                    <>
                      <span>{`${getNumberWithCurrency(
                        lot.quantity * lot.pricePerTon,
                        lot.currency
                      )} / `}</span>

                      <span>no bets</span>
                    </>
                  }
                </TableCell>
                <TableCell>
                  {(lot.enabledByAdmin && 'Active') || 'Inactive'}
                </TableCell>

                <TableCell>
                  <div className={editBlock}>
                    <MoreHorizIcon
                      className={deleteIcon}
                      onClick={() => handleEditClick(lot)}
                    />
                    <DisabledByDefaultIcon
                      className={editIcon}
                      onClick={handleDeactivateClick}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <CustomDialog
        content={<AdminDetailedLotView lot={openedLot} />}
        buttonsText={dialogButtonsText}
      />
    </>
  );
}
