import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Typography,
} from '@mui/material';

import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreIcon from '@mui/icons-material/More';

import { fetchLots, updateLot } from '@thunks/fetchLots';
import { fetchAllCategories } from '@thunks/fetchCategories';
import { toggleModal, selectModalState } from '@slices/modalSlice';
import { lotListSelector, setLotId } from '@slices/lotListSlice';
import { setUserId } from '@slices/usersListSlice';
import ENDPOINTS, { IMAGE_URL } from '@helpers/endpoints';

import getFormattedDate from '@helpers/getFormattedDate';
import getNumberWithCurrency from '@helpers/getNumberWithCurrency';
import ConfirmActionModal from '@customModals/confirmActionModal';

import DetailedLotViewModal from '../detailedLotViewModal';

import styles from './adminLotsList.module.scss';
import tableStyles from '../usersList/usersList.module.scss';

const baseURL = `${IMAGE_URL}${ENDPOINTS.IMAGES}`;

const {
  lotImage,
  lotTitleBlock,
  title,
  disableIcon,
  enableIcon,
  statusCell,
  moreInfoIcon,
  priceBet,
  lotTitleBlockCell,
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
      <Typography component="h2" variant="h6" color="primary">
        Lots
      </Typography>
      <Table size="small">
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

                <TableCell className={lotTitleBlockCell}>
                  <div className={lotTitleBlock}>
                    <Avatar
                      className={lotImage}
                      alt="Lot image"
                      src={
                        lot.images.length > 0 &&
                        `${baseURL}/${lot.images[0].name}`
                      }
                      variant="rounded"
                      ic
                    >
                      <ImageNotSupportedIcon />
                    </Avatar>
                    <p
                      className={`${userName} ${title}`}
                      onClick={() => handleEditClick(lot.id, lot.userId)}
                    >
                      {lot.title}
                    </p>
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
                    <div className={priceBet}>
                      <div>{`${getNumberWithCurrency(
                        lot.quantity * lot.pricePerTon,
                        lot.currency
                      )} / `}</div>
                      <div>no bets</div>
                    </div>
                  }
                </TableCell>
                <TableCell>
                  <div className={statusCell}>
                    {`${
                      lot.enabledByAdmin
                        ? 'Enabled by Admin'
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
        text="This action changes the lot status. Do you confirm the action?"
        setConfirmStatus={setConfirmStatus}
      />
    </>
  );
}
