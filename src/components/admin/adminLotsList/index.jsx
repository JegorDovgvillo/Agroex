import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, generatePath } from 'react-router-dom';
import _ from 'lodash';

import {
  GridRowModes,
  DataGrid,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

import { CircularProgress } from '@mui/material';

import { getFilteredLots } from '@thunks/fetchLots';
import { fetchUsers } from '@thunks/fetchUsers';

import {
  toggleModal,
  selectModalState,
  setModalFields,
  clearModalsFields,
  selectModal,
} from '@slices/modalSlice';
import {
  lotListSelector,
  setLotId,
  // clearLotListErrors,
  // clearStatus,
} from '@slices/lotListSlice';
import { setUserId, usersListSelector } from '@slices/usersListSlice';
import { getSelectedCurrency } from '@slices/currencySlice';

import getFormattedDate from '@helpers/getFormattedDate';
import getNumberWithCurrency from '@helpers/getNumberWithCurrency';
import { getFormattedDuration } from '@helpers/getFormattedDuration';
import { handleChangeLotStatusByAdmin } from '@helpers/lotHandlers';
import ROUTES from '@helpers/routeNames';

import DetailedLotViewModal from '../detailedLotViewModal';
import { getTableHead } from './getTableHead';

import styles from './adminLotsList.module.scss';

const { container, editingRow } = styles;

const getFormattedString = (str) => {
  return _.words(_.startCase(str)).join(' ').toLowerCase();
};

const getInitialRows = (lots, users, adminInfo) => {
  return lots.map((lot) => {
    const user = _.find(users, { id: lot.userId });

    const row = {
      id: lot.id,
      description: lot.description,
      user: user?.username || user?.name,
      variety: lot.variety,
      size: lot.size,
      packaging: lot.packaging,
      duration: getFormattedDuration(lot.duration),
      quantity: lot.quantity,
      creationDate: getFormattedDate({
        date: lot.creationDate,
        timeZone: adminInfo.zoneinfo,
      }),
      expirationDate: lot.expirationDate
        ? getFormattedDate({
            date: lot.expirationDate,
            timeZone: adminInfo.zoneinfo,
          })
        : '',
      lotType: getFormattedString(lot.lotType),
      price: getNumberWithCurrency(lot.price, lot.currency),
      minPrice: getNumberWithCurrency(lot.minPrice, lot.currency),
      status: lot.status,
      userStatus: lot.userStatus,
      bets: lot.bets.length ? 'yes' : 'no',
      innerStatus: getFormattedString(lot.innerStatus),
    };

    return row;
  });
};

export default function AdminLotsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lots = useSelector(lotListSelector);
  const users = useSelector(usersListSelector);
  const adminInfo = useSelector((state) => state.usersList.userInfo);
  const [currLotId, setCurrLotId] = useState(null);
  const [rows, setRows] = useState([]);
  const [editedValue, setEditedValue] = useState('');
  const [rowModesModel, setRowModesModel] = useState({});
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    description: false,
    variety: false,
    size: false,
    packaging: false,
    quantity: false,
    price: false,
    minPrice: false,
  });
  const isModalOpened = useSelector((state) =>
    selectModalState(state, 'infoModal')
  );
  const adminMessageModalData = useSelector((state) =>
    selectModal(state, 'adminMessageModal')
  );
  const confirmModalData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );

  const selectedCurrency = useSelector(getSelectedCurrency);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => {
    setEditedValue('');
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => {
    setCurrLotId(id);
    if (!editedValue) {
      setRowModesModel({
        ...rowModesModel,
        [currLotId]: {
          mode: GridRowModes.View,
        },
      });
    } else {
      dispatch(
        setModalFields({
          modalId: 'confirmModal',
          text: 'This action changes the lot status. Do you confirm the action?',
          isOpen: true,
        })
      );
    }
  };

  const handleShowMoreClick = (id) => {
    const userId = _.find(lots, { id: id })?.userId;

    dispatch(setLotId(id));
    dispatch(setUserId(userId));
    dispatch(toggleModal('infoModal'));
  };

  const handleCancelClick = (id) => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);

    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const viewDetailsCard = (lotId) => {
    const path = generatePath(ROUTES.LOTS_DETAILS, {
      id: lotId,
    });

    navigate(path);
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
      setEditedValue,
      viewDetailsCard
    );

  const fetchChangeLotStatus = async () => {
    const { adminMessage } = adminMessageModalData;
    const isLotStatusChanged = await handleChangeLotStatusByAdmin({
      dispatch,
      lotId: currLotId,
      status: editedValue,
      adminMessage,
      selectedCurrency,
    });

    if (isLotStatusChanged) {
      setRowModesModel({
        ...rowModesModel,
        [currLotId]: {
          mode: GridRowModes.View,
        },
      });
    }
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedCurrency) return;

    dispatch(
      getFilteredLots({
        params: { status: 'all' },
        currency: selectedCurrency,
      })
    );
  }, [dispatch, selectedCurrency]);

  useEffect(() => {
    if (_.every([lots, users], (item) => !_.isEmpty(item))) {
      const rows = getInitialRows(lots, users, adminInfo);
      setRows(rows);
    }
  }, [lots, users]);

  useEffect(() => {
    if (confirmModalData.confirmStatus) {
      editedValue === 'rejected'
        ? dispatch(toggleModal('adminMessageModal'))
        : fetchChangeLotStatus();
    }
  }, [confirmModalData]);

  useEffect(() => {
    if (editedValue === 'rejected' && adminMessageModalData.adminMessage) {
      fetchChangeLotStatus();
    }
  }, [adminMessageModalData.adminMessage]);

  return (
    <>
      {rows && (
        <div className={container}>
          <DataGrid
            isCellEditable={(params) => params.row.status !== 'finished'}
            scrollbarSize={20}
            autoHeight
            rows={rows}
            columns={tableHead}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={setRowModesModel}
            onRowEditStop={handleRowEditStop}
            slots={{ noRowsOverlay: CircularProgress }}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={setColumnVisibilityModel}
            getRowClassName={(params) =>
              params.id in rowModesModel &&
              rowModesModel[params.id].mode === GridRowModes.Edit
                ? `${editingRow}`
                : ''
            }
          />

          {isModalOpened && <DetailedLotViewModal />}
        </div>
      )}
    </>
  );
}
