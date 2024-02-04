import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material';

import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { fetchLots } from '@store/thunks/fetchLots';
import { openInfoModal } from '@store/slices/modalSlice';
import { lotListSelector } from '@store/slices/lotListSlice';
import { setLotId } from '@store/slices/lotListSlice';
import { updateLot } from '@store/thunks/fetchLots';
import { setUserId } from '@store/slices/usersListSlice';
import { openConfirmModal } from '@store/slices/modalSlice';

import getFormattedDate from '@helpers/getFormattedDate';
import getNumberWithCurrency from '@helpers/getNumberWithCurrency';

import DetailedLotViewModal from '../detailedLotViewModal';
import ConfirmActionModal from '../../customModals/confirmActionModal';

import image from '@assets/images/77d4dc59-3013-41aa-8a7b-cb27cb6fa425.jpg';

import styles from './adminLotsList.module.scss';
import tableStyles from '../usersList/usersList.module.scss';

const { lotImage, lotTitleBlock } = styles;
const { tableRow, userName, deleteIcon, editBlock } = tableStyles;

export default function AdminLotsList() {
  const dispatch = useDispatch();
  const lots = useSelector(lotListSelector);
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [openedLot, setOpenedLot] = useState(null);

  useEffect(() => {
    dispatch(fetchLots());
  }, [dispatch]);

  useEffect(() => {
    if (confirmStatus && openedLot) {
      console.log('useEffect', openedLot.id);
      handleChangeLot({ ...openedLot });
      setConfirmStatus(false);
    }
  }, [confirmStatus, openedLot]);

  const handleEditClick = (id, userId) => {
    dispatch(openInfoModal());
    dispatch(setLotId(id));
    dispatch(setUserId(userId));
  };

  const handleChangeLotStatusClick = (lot) => {
    setOpenedLot(lot);

    dispatch(openConfirmModal());
  };

  const handleChangeLot = ({ ...lot }) => {
    const lotData = { ...lot, enabledByAdmin: !lot.enabledByAdmin };
    const { id } = lot;

    lotData && id && dispatch(updateLot({ id, lotData }));
  };

  const tableHead = [
    'ID',
    'Title',
    'Quantity',
    'Price per/ton',
    'Creation Date',
    'Expiration Date',
    'Lot Type',
    'Price/Bet',
    'Status',
    'Actions',
  ];

  return (
    <>
      <h6>Lots</h6>
      <Table size='small'>
        <TableHead>
          <TableRow className={tableRow}>
            {tableHead.map((el) => (
              <TableCell key={el}>{el}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {lots &&
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
                      onClick={() => handleEditClick(lot.id, lot.userId)}
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
                  {`${
                    lot.enabledByAdmin
                      ? 'Enabled by Admin'
                      : 'Disabled by Admin'
                  }`}
                </TableCell>

                <TableCell>
                  <div className={editBlock}>
                    <MoreHorizIcon
                      className={deleteIcon}
                      onClick={() => handleEditClick(lot.id, lot.userId)}
                    />
                    <DisabledByDefaultIcon
                      className={deleteIcon}
                      onClick={() => handleChangeLotStatusClick(lot)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <DetailedLotViewModal handleChangeLot={handleChangeLot} />
      <ConfirmActionModal
        text='This action deactivates the lot. Do you confirm the action?'
        setConfirmStatus={setConfirmStatus}
      />
    </>
  );
}
