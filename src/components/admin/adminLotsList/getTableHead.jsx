import _ from 'lodash';

import { Select, MenuItem, Avatar } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid';

import { IMAGE_URL } from '@helpers/endpoints';

import styles from './adminLotsList.module.scss';

const {
  saveIcon,
  cancelIcon,
  editIcon,
  showMoreIcon,
  statusSelectField,
  lotTitleBlock,
  lotImage,
  title,
  cell,
  actionsCell,
  headerCell,
} = styles;

export const getTableHead = (
  lots,
  rowModesModel,
  handleEditClick,
  handleSaveClick,
  handleShowMoreClick,
  handleCancelClick,
  setEditedValue,
  viewDetailsCard
) => {
  const handleSelectChange = (params, newValue) => {
    setEditedValue(_.camelCase(newValue));
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
        return ['new', 'on moderation', 'rejected', 'approved'];
      case 'onModeration':
        return ['on moderation', 'rejected', 'approved'];
      case 'rejected':
        return ['rejected', 'on moderation', 'approved'];
      case 'approved':
        return ['approved', 'on moderation', 'rejected'];
    }

    return ['new', 'on moderation', 'rejected', 'approved'];
  };

  const getTitle = (params) => {
    const lot = _.find(lots, { id: params.id });

    return (
      <div className={lotTitleBlock}>
        <Avatar
          className={lotImage}
          alt="Lot image"
          src={
            lot.images.length > 0 ? `${IMAGE_URL}/${lot.images[0].name}` : null
          }
          variant="rounded"
        >
          <ImageNotSupportedIcon />
        </Avatar>
        <p className={title} onClick={() => viewDetailsCard(lot.id)}>
          {lot.title}
        </p>
      </div>
    );
  };

  const getSelectItem = (params) => {
    return (
      <Select
        disabled={params.row.status === 'finished'}
        value={params.value}
        onChange={(e) => handleSelectChange(params, e.target.value)}
        className={statusSelectField}
      >
        {getStatusSelectOptions(params).map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    );
  };

  const getTableActions = ({ id }) => {
    const isLotTransaction = !_.isEmpty(_.find(lots, { id: id })?.bets);
    const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
    const isRowEditable = _.find(lots, { id: id })?.status !== 'finished';

    if (!isRowEditable) {
      return [
        <GridActionsCellItem
          key={`showMoreIcon${id}`}
          icon={<ReadMoreIcon />}
          label="Show More"
          onClick={() => handleShowMoreClick(id)}
          className={showMoreIcon}
        />,
      ];
    }

    if (isInEditMode && isRowEditable) {
      return [
        <GridActionsCellItem
          key={`saveIcon${id}`}
          icon={<SaveIcon />}
          label="Save"
          onClick={() => handleSaveClick(id)}
          className={saveIcon}
        />,
        <GridActionsCellItem
          key={`cancelIcon${id}`}
          icon={<CancelIcon />}
          label="Cancel"
          onClick={() => handleCancelClick(id)}
          className={cancelIcon}
        />,
      ];
    }

    return [
      <>
        {!isLotTransaction && (
          <GridActionsCellItem
            key={`editIcon${id}`}
            icon={<EditIcon />}
            label="Edit"
            className={editIcon}
            onClick={() => handleEditClick(id)}
          />
        )}
      </>,
      <GridActionsCellItem
        key={`showMoreIcon${id}`}
        icon={<ReadMoreIcon />}
        label="Show More"
        onClick={() => handleShowMoreClick(id)}
        className={showMoreIcon}
      />,
    ];
  };

  const tableHead = [
    {
      field: 'id',
      headerName: 'ID',
      headerClassName: `${headerCell}`,
      width: 40,
    },
    {
      field: 'title',
      headerName: 'Title',
      headerClassName: `${headerCell}`,
      width: 200,
      renderCell: (params) => getTitle(params),
    },
    {
      field: 'user',
      headerName: 'User Name',
      headerClassName: `${headerCell}`,
      width: 150,
    },
    {
      field: 'description',
      headerName: 'Description',
      headerClassName: `${headerCell}`,
      width: 150,
    },
    {
      field: 'variety',
      headerName: 'Variety',
      headerClassName: `${headerCell}`,
      width: 150,
    },
    {
      field: 'size',
      headerName: 'Size',
      headerClassName: `${headerCell}`,
      width: 150,
    },
    {
      field: 'packaging',
      headerName: 'Packaging',
      headerClassName: `${headerCell}`,
      width: 150,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      cellClassName: `${cell}`,
      headerClassName: `${headerCell}`,
      width: 90,
    },
    {
      field: 'creationDate',
      headerName: 'Creation Date',
      cellClassName: `${cell}`,
      headerClassName: `${headerCell}`,
      width: 150,
    },
    {
      field: 'expirationDate',
      headerName: 'Expiration Date',
      cellClassName: `${cell}`,
      headerClassName: `${headerCell}`,
      width: 150,
    },
    {
      field: 'duration',
      headerName: 'Duration',
      cellClassName: `${cell}`,
      headerClassName: `${headerCell}`,
      width: 100,
    },
    {
      field: 'lotType',
      headerName: 'Lot Type',
      cellClassName: `${cell}`,
      headerClassName: `${headerCell}`,
      width: 100,
    },
    {
      field: 'price',
      headerName: 'Price',
      cellClassName: `${cell}`,
      headerClassName: `${headerCell}`,
      width: 150,
    },
    {
      field: 'minPrice',
      headerName: 'Min Price',
      cellClassName: `${cell}`,
      headerClassName: `${headerCell}`,
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Lot Status',
      cellClassName: `${cell}`,
      headerClassName: `${headerCell}`,
      width: 100,
    },
    {
      field: 'userStatus',
      headerName: 'Lot Status from User',
      cellClassName: `${cell}`,
      headerClassName: `${headerCell}`,
      width: 100,
    },
    {
      field: 'bets',
      headerName: 'Is Transaction',
      cellClassName: `${cell}`,
      headerClassName: `${headerCell}`,
      width: 95,
    },
    {
      field: 'innerStatus',
      headerName: 'Status',
      editable: true,
      cellClassName: `${cell}`,
      headerAlign: 'center',
      width: 120,
      type: 'singleSelect',
      valueOptions: (params) => getStatusSelectOptions(params),
      renderEditCell: (params) => getSelectItem(params),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      cellClassName: `${cell} ${actionsCell}`,
      width: 100,
      getActions: ({ id }) => getTableActions({ id }),
    },
  ];

  return tableHead;
};
