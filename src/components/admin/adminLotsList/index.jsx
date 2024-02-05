import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreIcon from '@mui/icons-material/More';

import { fetchLots, updateLot } from '@store/thunks/fetchLots';
import { fetchAllCategories } from '@store/thunks/fetchCategories';
import { toggleModal } from '@store/slices/modalSlice';
import { lotListSelector, setLotId } from '@store/slices/lotListSlice';
import { setUserId } from '@store/slices/usersListSlice';
import { selectModalState } from '../../../store/slices/modalSlice';

import getFormattedDate from '@helpers/getFormattedDate';
import getNumberWithCurrency from '@helpers/getNumberWithCurrency';

import DetailedLotViewModal from '../detailedLotViewModal';
import ConfirmActionModal from '../../customModals/confirmActionModal';

import image from '@assets/images/77d4dc59-3013-41aa-8a7b-cb27cb6fa425.jpg';

import styles from './adminLotsList.module.scss';
import tableStyles from '../usersList/usersList.module.scss';

const {
  lotImage,
  lotTitleBlock,
  disableIcon,
  enableIcon,
  statusCell,
  moreInfoIcon,
} = styles;
const { tableRow, userName } = tableStyles;

export default function AdminLotsList() {
  const dispatch = useDispatch();
  const lots = useSelector(lotListSelector);
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [openedLot, setOpenedLot] = useState(null);
  const isModalOpened = useSelector((state) =>
    selectModalState(state, 'infoModal')
  );

  const handleChangeLot = useCallback(
    (lot) => {
      const lotData = { ...lot, enabledByAdmin: !lot.enabledByAdmin };
      const { id } = lot;

      lotData && id && dispatch(updateLot({ id, lotData }));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchLots());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (confirmStatus && openedLot) {
      handleChangeLot({ ...openedLot });
      setConfirmStatus(false);
    }
  }, [handleChangeLot, confirmStatus, openedLot]);

  const handleEditClick = (id, userId) => {
    dispatch(toggleModal('infoModal'));
    dispatch(setLotId(id));
    dispatch(setUserId(userId));
  };

  const handleChangeLotStatusClick = (lot) => {
    setOpenedLot(lot);
    dispatch(toggleModal('confirmModal'));
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
                  <div className={statusCell}>
                    {`${
                      lot.enabledByAdmin
                        ? 'Enabled  by Admin'
                        : 'Disabled by Admin'
                    }`}

                    {!lot.enabledByAdmin && (
                      <CancelIcon
                        className={disableIcon}
                        onClick={() => handleChangeLotStatusClick(lot)}
                      />
                    )}
                    {lot.enabledByAdmin && (
                      <CheckCircleOutlineIcon
                        className={enableIcon}
                        onClick={() => handleChangeLotStatusClick(lot)}
                      />
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div>
                    <MoreIcon
                      className={moreInfoIcon}
                      onClick={() => handleEditClick(lot.id, lot.userId)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {isModalOpened && (
        <DetailedLotViewModal handleChangeLot={handleChangeLot} />
      )}
      <ConfirmActionModal
        text='This action changes the lot status. Do you confirm the action?'
        setConfirmStatus={setConfirmStatus}
      />
    </>
  );
}
