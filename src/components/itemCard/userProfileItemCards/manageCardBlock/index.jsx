import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Menu, MenuItem, ListItemIcon } from '@mui/material';

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';

import { toggleModal } from '@slices/modalSlice';

import { CustomButton } from '@buttons/CustomButton';
import ConfirmActionModal from '@customModals/confirmActionModal';

import ROUTES from '@helpers/routeNames';
import { changeLotStatusByUser } from '@thunks/fetchLots';
import { CustomSnackbar } from '@components/customSnackbar';

import styles from './manageCard.module.scss';

const { deactivate } = styles;

const ManageCardBlock = ({ id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loadingStatus } = useSelector((state) => state.lotList);
  const [confirmDeactivateStatus, setConfirmStatus] = useState(false);
  const [snackbarProps, setSnackbarProps] = useState(null);

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
    handleClose();
  };

  const handleEdit = () => {
    navigate(ROUTES.UPDATE_LOT.replace(':id', id));
  };

  useEffect(() => {
    if (confirmDeactivateStatus) {
      dispatch(changeLotStatusByUser({ lotId: id, isActive: false }));
      setConfirmStatus(false);

      if (loadingStatus === 'fulfilled') {
        setSnackbarProps({
          message: 'Lot has been successfully deactivated',
          severity: 'success',
        });
        dispatch(toggleModal('snackbar'));
      }
    }
  }, [confirmDeactivateStatus]);

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
      <CustomSnackbar {...snackbarProps} />
    </>
  );
};

export default ManageCardBlock;
