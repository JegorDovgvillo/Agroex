import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import _ from 'lodash';

import { Menu, MenuItem, ListItemIcon } from '@mui/material';

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

import { CustomButton } from '@buttons/CustomButton';

import {
  handleEditLotButtonClick,
  handleDeleteBtnClick,
  handleToggleUserLotStatusBtnClick,
} from '@helpers/lotHandlers';

import styles from './manageCard.module.scss';

const { errorStyleStatus, baseStyleStatus } = styles;

const ManageCardBlock = ({ id, actions }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleToggleUserLotStatus = (event) => {
    event.stopPropagation();
    handleToggleUserLotStatusBtnClick(dispatch, id);
    handleClose(event);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    handleEditLotButtonClick(navigate, id);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    handleDeleteBtnClick(dispatch, id);
    handleClose(event);
  };

  const getTargetActions = () => {
    return _.map(actions, (action) => {
      const result = { action: _.capitalize(action) };

      switch (action) {
        case 'edit':
          result.func = handleEdit;
          result.icon = <ModeEditOutlineOutlinedIcon />;
          result.style = baseStyleStatus;
          break;

        case 'activate':
          result.func = handleToggleUserLotStatus;
          result.icon = <PlayArrowOutlinedIcon />;
          result.style = baseStyleStatus;
          break;

        case 'deactivate':
          result.func = handleToggleUserLotStatus;
          result.icon = <PowerSettingsNewOutlinedIcon />;
          result.style = errorStyleStatus;
          break;

        case 'delete':
          result.func = handleDelete;
          result.icon = <DeleteForeverOutlinedIcon />;
          result.style = errorStyleStatus;
          break;
      }

      return result;
    });
  };

  const targetActions = getTargetActions();

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
          {targetActions.map((item) => (
            <MenuItem
              key={item.action}
              onClick={item.func}
              className={item.style}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {item.action}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </>
  );
};

export default ManageCardBlock;
