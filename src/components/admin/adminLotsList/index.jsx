import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import {
  GridRowModes,
  DataGrid,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

import { fetchLots, changeLotStatusByAdmin } from '@thunks/fetchLots';

import { toggleModal, selectModalState } from '@slices/modalSlice';
import {
  lotListSelector,
  setLotId,
  clearErrors,
  clearChangeLotLoadingStatus,
} from '@slices/lotListSlice';
import { setUserId } from '@slices/usersListSlice';

import { getDHMSFromMilliseconds } from '@helpers/getDHMSFromMilliseconds';
import getFormattedDate from '@helpers/getFormattedDate';
import getNumberWithCurrency from '@helpers/getNumberWithCurrency';
import ConfirmActionModal from '@customModals/confirmActionModal';
import AdminMessageModal from '@customModals/adminMessageModal';

import DetailedLotViewModal from '../detailedLotViewModal';
import { getTableHead } from './getTableHead';

import styles from './adminLotsList.module.scss';

const { container } = styles;

const getFormattedDuration = (duration) => {
  const { days, hours, minutes } = getDHMSFromMilliseconds(duration);

  const formattedDuration = _.compact([
    days > 0 && `${days}d`,
    hours > 0 && `${hours}h`,
    minutes > 0 && `${minutes}m`,
  ]).join(' ');

  return formattedDuration;
};

const getFormattedString = (str) => {
  return _.words(_.startCase(str)).join(' ').toLowerCase();
};

export default function AdminLotsList() {
  const dispatch = useDispatch();
  const lots = useSelector(lotListSelector);

  const initialRows = lots.map((lot) => {
    const row = {
      id: lot.id,
      description: lot.description,
      variety: lot.variety,
      size: lot.size,
      packaging: lot.packaging,
      duration: getFormattedDuration(lot.duration),
      quantity: lot.quantity,
      creationDate: getFormattedDate(lot.creationDate),
      expirationDate: lot.expirationDate
        ? getFormattedDate(lot.expirationDate)
        : '',
      lotType: getFormattedString(lot.lotType),
      price: getNumberWithCurrency(lot.price, lot.currency),
      minPrice: getNumberWithCurrency(lot.minPrice, lot.currency),
      userStatus: lot.userStatus,
      bets: lot.bets.length ? 'yes' : 'no',
      innerStatus: getFormattedString(lot.innerStatus),
    };

    return row;
  });

  const [confirmStatus, setConfirmStatus] = useState(false);
  const [currLotId, setCurrLotId] = useState(null);
  const [rows, setRows] = useState(initialRows);
  const [editedValue, setEditedValue] = useState('');
  const [adminComment, setAdminComment] = useState(null);
  const [rowModesModel, setRowModesModel] = useState({});
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    description: false,
    variety: false,
    size: false,
    packaging: false,
  });
  const isModalOpened = useSelector((state) =>
    selectModalState(state, 'infoModal')
  );
  const lotListErrors = useSelector((state) => state.lotList.errors);
  const changeLotLoadingStatus = useSelector(
    (state) => state.lotList.changeLotLoadingStatus
  );

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setCurrLotId(id);
    setEditedValue('');
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = () => {
    if (!editedValue) {
      setRowModesModel({
        ...rowModesModel,
        [currLotId]: {
          mode: GridRowModes.View,
        },
      });
    } else {
      dispatch(toggleModal('confirmModal'));
    }
  };

  const handleShowMoreClick = (id) => () => {
    const userId = _.find(lots, { id: id })?.userId;

    dispatch(setLotId(id));
    dispatch(setUserId(userId));
    dispatch(toggleModal('infoModal'));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);

    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const tableHead =
    lots &&
    getTableHead(
      lots,
      rowModesModel,
      handleEditClick,
      handleSaveClick,
      handleShowMoreClick,
      handleCancelClick,
      setEditedValue
    );

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const fetchChangeLotStatus = () => {
    dispatch(
      changeLotStatusByAdmin({
        lotId: currLotId,
        status: editedValue,
        adminComment: adminComment,
      })
    );
  };

  useEffect(() => {
    dispatch(fetchLots());
  }, [dispatch]);

  useEffect(() => {
    if (confirmStatus) {
      editedValue === 'rejected'
        ? dispatch(toggleModal('adminMessageModal'))
        : fetchChangeLotStatus();
    }
  }, [confirmStatus]);

  useEffect(() => {
    if (editedValue === 'rejected' && adminComment) {
      fetchChangeLotStatus();
    }
  }, [adminComment]);

  useEffect(() => {
    if (changeLotLoadingStatus === 'rejected' && lotListErrors) {
      dispatch(clearErrors());
      dispatch(clearChangeLotLoadingStatus());
      setConfirmStatus(false);
    }

    if (changeLotLoadingStatus === 'fulfilled') {
      setRowModesModel({
        ...rowModesModel,
        [currLotId]: {
          mode: GridRowModes.View,
        },
      });

      dispatch(clearChangeLotLoadingStatus());
      setConfirmStatus(false);
    }
  }, [lotListErrors, changeLotLoadingStatus]);

  return (
    <>
      {lots && rows && (
        <div className={container}>
          <DataGrid
            isCellEditable={(params) => !params.bets}
            scrollbarSize={20}
            autoHeight
            rows={rows}
            columns={tableHead}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={setColumnVisibilityModel}
          />

          {isModalOpened && <DetailedLotViewModal />}
          <ConfirmActionModal
            text="This action changes the lot status. Do you confirm the action?"
            setConfirmStatus={setConfirmStatus}
          />
          <AdminMessageModal
            setAdminMessage={setAdminComment}
            setConfirmStatus={setConfirmStatus}
          />
        </div>
      )}
    </>
  );
}
