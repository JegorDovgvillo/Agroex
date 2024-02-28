import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Menu, MenuItem, ListItemIcon } from '@mui/material';

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

import { toggleModal } from '@slices/modalSlice';

import { CustomButton } from '@buttons/CustomButton';
import ConfirmActionModal from '@customModals/confirmActionModal';

import ROUTES from '@helpers/routeNames';
import { changeLotStatusByUser, deleteLot } from '@thunks/fetchLots';

import styles from './manageCard.module.scss';

const { deactivate } = styles;

const ManageCardBlock = ({ id, actions }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmStatus, setConfirmStatus] = useState(false);
  const [confirmModalText, setConfirmModalText] = useState(null);
  const [action, setAction] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleUserLotStatus = () => {
    setConfirmModalText(
      'This action changes the lot status. Do you confirm the action?'
    );
    setAction('toggleUserLotStatus');
    dispatch(toggleModal('confirmModal'));
    handleClose();
  };

  const handleEdit = () => {
    navigate(ROUTES.UPDATE_LOT.replace(':id', id));
  };

  const handleDelete = () => {
    setConfirmModalText('The lot will be permanently deleted. Are you sure?');
    setAction('deleteLot');
    dispatch(toggleModal('confirmModal'));
    handleClose();
  };

  useEffect(() => {
    if (confirmStatus && action === 'toggleUserLotStatus') {
      dispatch(
        changeLotStatusByUser({
          lotId: id,
          isActive: actions === 'activateDelete',
        })
      );
    }

    if (confirmStatus && action === 'deleteLot') {
      dispatch(deleteLot({ id }));
    }
  }, [confirmStatus]);

  return (
    <>
      <div>
        <div
          id="manage-button"
          aria-controls={open ? 'manage-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <CustomButton
            text="Manage"
            size="S"
            type="clear"
            icon={<SettingsOutlinedIcon />}
          />
        </div>
        <Menu
          id="manage-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'manage-button',
          }}
        >
          {actions === 'editDeactivate' && (
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <ModeEditOutlineOutlinedIcon />
              </ListItemIcon>
              Edit
            </MenuItem>
          )}
          {actions === 'editDeactivate' && (
            <MenuItem
              onClick={handleToggleUserLotStatus}
              className={deactivate}
            >
              <ListItemIcon>
                <PowerSettingsNewOutlinedIcon />
              </ListItemIcon>
              Deactivate
            </MenuItem>
          )}
          {actions === 'activateDelete' && (
            <MenuItem
              onClick={handleToggleUserLotStatus}
              className={deactivate}
            >
              <ListItemIcon>
                <PlayArrowOutlinedIcon />
              </ListItemIcon>
              Activate
            </MenuItem>
          )}
          {actions === 'activateDelete' && (
            <MenuItem onClick={handleDelete} className={deactivate}>
              <ListItemIcon>
                <DeleteForeverOutlinedIcon />
              </ListItemIcon>
              Delete
            </MenuItem>
          )}
        </Menu>
      </div>
      <ConfirmActionModal
        text={confirmModalText}
        setConfirmStatus={setConfirmStatus}
      />
    </>
  );
};

export default ManageCardBlock;
