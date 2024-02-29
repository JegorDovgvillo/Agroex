import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import ReadMoreIcon from '@mui/icons-material/ReadMore';

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';
import { Select, MenuItem, LinearProgress } from '@mui/material';
import AdminMessageModal from '../../customModals/adminMessageModal';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
//import CancelIcon from '@mui/icons-material/Cancel';
import MoreIcon from '@mui/icons-material/More';

import {
  fetchLots,
  updateLot,
  changeLotStatusByAdmin,
} from '@thunks/fetchLots';

import { toggleModal, selectModalState } from '@slices/modalSlice';
import { lotListSelector, setLotId } from '@slices/lotListSlice';
import { setUserId } from '@slices/usersListSlice';

import ENDPOINTS, { IMAGE_URL } from '@helpers/endpoints';
import convertImagesToFiles from '@helpers/convertImagesToFiles';

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
  const [currLotId, setCurrLotId] = useState(null);
  const isModalOpened = useSelector((state) =>
    selectModalState(state, 'infoModal')
  );
  const [adminComment, setAdminComment] = useState(null);

  const initialRows = lots.map((lot) => {
    const row = {
      id: lot.id,
      title: lot.title,
      description: lot.description,
      variety: lot.variety,
      size: lot.size,
      packaging: lot.packaging,
      duration: lot.duration, //todo convert to DHM
      quantity: lot.quantity,
      creationDate: getFormattedDate(lot.creationDate),
      expirationDate: lot.expirationDate
        ? getFormattedDate(lot.expirationDate)
        : '',
      lotType: lot.lotType,
      price: getNumberWithCurrency(lot.price, lot.currency),
      minPrice: getNumberWithCurrency(lot.minPrice, lot.currency),
      userStatus: lot.userStatus,
      bets: !!lot.bets.length,
      innerStatus: lot.innerStatus,
    };
    return row;
  });

  const [rows, setRows] = useState(initialRows);
  const [editedValue, setEditedValue] = useState('');
  const [rowModesModel, setRowModesModel] = useState({});
  const [isStatusFieldEditable, setIsStatusFieldEditable] = useState(null);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    description: false,
    variety: false,
    size: false,
    packaging: false,
  });

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
    const lot = _.find(lots, { id: currLotId });

    dispatch(toggleModal('confirmModal'));
    setOpenedLot(lot);
  };

  const handleShowMoreClick = (id) => () => {
    dispatch(setLotId(id));
    const userId = _.find(lots, { id: id })?.userId;
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

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  useEffect(() => {
    if (confirmStatus && editedValue) {
      const isRejectWithMessage = editedValue === 'rejected' && adminComment;
      editedValue === 'rejected' && dispatch(toggleModal('adminMessageModal'));
      if (isRejectWithMessage || editedValue !== 'rejected') {
        dispatch(
          changeLotStatusByAdmin({
            lotId: currLotId,
            status: editedValue,
            adminComment: adminComment,
          })
        );

        setRowModesModel({
          ...rowModesModel,
          [currLotId]: {
            mode: GridRowModes.View,
          },
        });

        setConfirmStatus(false);
        setAdminComment(null);
      }
    }
  }, [confirmStatus, editedValue, adminComment, currLotId]);

  const handleSelectChange = (params, newValue) => {
    setEditedValue(newValue);
    params.api.setEditCellValue({
      id: params.id,
      field: params.field,
      value: newValue,
    });
  };

  const getStatusSelectOptions = (params) => {
    const lot = _.find(lots, { id: params.id });

    switch (lot?.innerStatus) {
      case 'new':
        return ['new', 'onModeration', 'rejected', 'approved'];
      case 'onModeration':
        return ['onModeration', 'rejected', 'approved'];
      case 'rejected':
        return ['rejected', 'onModeration', 'approved'];
      case 'approved':
        return ['approved', 'rejected'];
    }
    return ['new', 'onModeration', 'rejected', 'approved'];
  };

  const tableHead = [
    { field: 'id', headerName: 'ID', width: 40 },

    {
      field: 'title',
      headerName: 'Title',
      width: 150,
    },
    { field: 'description', headerName: 'Description', width: 150 },
    { field: 'variety', headerName: 'Variety', width: 150 },
    { field: 'size', headerName: 'Size', width: 150 },
    { field: 'packaging', headerName: 'Packaging', width: 150 },

    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 90,
    },
    {
      field: 'creationDate',
      headerName: 'Creation Date',
      width: 150,
    },
    {
      field: 'expirationDate',
      headerName: 'Expiration Date',
      width: 150,
    },
    { field: 'duration', headerName: 'Duration', width: 100 },
    {
      field: 'lotType',
      headerName: 'Lot Type',
      width: 100,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 100,
    },
    {
      field: 'minPrice',
      headerName: 'Min Price',
      width: 100,
    },
    {
      field: 'userStatus',
      headerName: 'User Status',
      width: 100,
    },

    {
      field: 'bets',
      headerName: 'Is Transaction',
      width: 120,
    },

    {
      field: 'innerStatus',
      headerName: 'Status',
      editable: true,
      width: 120,
      type: 'singleSelect',
      valueOptions: (params) => getStatusSelectOptions(params),
      renderEditCell: (params) => (
        <Select
          value={params.value}
          onChange={(e) => handleSelectChange(params, e.target.value)}
          sx={{ width: '100%' }}
        >
          {getStatusSelectOptions(params).map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,

      getActions: ({ id }) => {
        const isLotTransaction = !_.isEmpty(
          _.find(lots, { id: id })?.bets.length
        );

        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <>
            {!isLotTransaction && (
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />
            )}
          </>,
          <GridActionsCellItem
            icon={<ReadMoreIcon />}
            label="Show More"
            onClick={handleShowMoreClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    dispatch(fetchLots());
  }, [dispatch]);

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
      {lots && (
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
          processRowUpdate={processRowUpdate}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
        />
      )}

      {isModalOpened && <DetailedLotViewModal />}
      <ConfirmActionModal
        text="This action changes the lot status. Do you confirm the action?"
        setConfirmStatus={setConfirmStatus}
      />
      <AdminMessageModal setAdminMessage={setAdminComment} />
    </div>
  );
}
