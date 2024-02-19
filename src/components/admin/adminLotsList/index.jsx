import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

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
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const lots = useSelector(lotListSelector);

  const [confirmStatus, setConfirmStatus] = useState(false);
  const [openedLot, setOpenedLot] = useState(null);

  const isModalOpened = useSelector((state) =>
    selectModalState(state, 'infoModal')
  );

  const convertImagesToFiles = async (images) => {
    const files = [];

    for (const { id, name } of images) {
      const URL = `${IMAGE_URL}${ENDPOINTS.IMAGES}`;
      const response = await fetch(`${URL}/${name}`);
      const blob = await response.blob();
      const file = new File([blob], name, { type: 'image/jpeg' });
      file.id = id;
      files.push(file);
    }
    setFiles(files);
  };

  const handleChangeLot = useCallback(
    (lot) => {
      const formData = new FormData();
      const lotData = _.omit(
        { ...lot, enabledByAdmin: !lot.enabledByAdmin },
        'images'
      );
      const { id } = lot;

      _.forEach(files, (file) => {
        formData.append('file', file);
      });

      formData.append('data', JSON.stringify(lotData));

      dispatch(updateLot({ id: id, lotData: formData }));
    },
    [files, dispatch]
  );

  useEffect(() => {
    dispatch(fetchLots());
  }, [dispatch]);

  useEffect(() => {
    if (confirmStatus && openedLot) {
      handleChangeLot({ ...openedLot });
      setConfirmStatus(false);
    }
  }, [handleChangeLot, confirmStatus, openedLot]);

  const handleEditClick = async (lot) => {
    await convertImagesToFiles(lot.images || []);

    dispatch(toggleModal('infoModal'));
    dispatch(setLotId(lot.id));
    dispatch(setUserId(lot.userId));
  };

  const handleChangeLotStatusClick = async (lot) => {
    await convertImagesToFiles(lot.images || []);

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
                        lot.images.length > 0
                          ? `${baseURL}/${lot.images[0].name}`
                          : null
                      }
                      variant="rounded"
                    >
                      <ImageNotSupportedIcon />
                    </Avatar>
                    <p
                      className={`${userName} ${title}`}
                      onClick={() => handleEditClick(lot)}
                    >
                      {lot.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{`${getNumberWithCurrency(
                  lot.quantity
                )} ton`}</TableCell>
                <TableCell>
                  {getNumberWithCurrency(
                    lot.price / lot.quantity,
                    lot.currency
                  )}
                </TableCell>

                <TableCell>{getFormattedDate(lot.creationDate)}</TableCell>
                <TableCell>{getFormattedDate(lot.expirationDate)}</TableCell>
                <TableCell>{lot.lotType}</TableCell>
                <TableCell>
                  {
                    <div className={priceBet}>
                      <div>{`${getNumberWithCurrency(
                        lot.price,
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
                      onClick={() => handleEditClick(lot)}
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
