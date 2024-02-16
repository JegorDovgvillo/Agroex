import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Menu, MenuItem, ListItemIcon } from '@mui/material';

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';

import { toggleModal } from '@slices/modalSlice';

import { CustomButton } from '@buttons/CustomButton';
import ConfirmActionModal from '@customModals/confirmActionModal';

import ROUTES from '@helpers/routeNames';

import styles from './manageCard.module.scss';

const { deactivate } = styles;

const ManageCardBlock = ({ id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmStatus, setConfirmStatus] = useState(false);

  useEffect(() => {
    if (confirmStatus) {
      //todo set lot status to inactivated by user

      setConfirmStatus(false);
    }
  }, [confirmStatus]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeactivate = () => {
    dispatch(toggleModal('confirmModal'));
  };

  const handleEdit = () => {
    navigate(ROUTES.UPDATE_LOT.replace(':id', id));
  };

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
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <ModeEditOutlineOutlinedIcon />
            </ListItemIcon>
            Edit
          </MenuItem>
          <MenuItem onClick={handleDeactivate} className={deactivate}>
            <ListItemIcon>
              <PowerSettingsNewOutlinedIcon />
            </ListItemIcon>
            Deactivate
          </MenuItem>
        </Menu>
      </div>
      <ConfirmActionModal
        text="This action changes the lot status. Do you confirm the action?"
        setConfirmStatus={setConfirmStatus}
      />
    </>
  );
};

export default ManageCardBlock;
