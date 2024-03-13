import { useState } from 'react';

import { ListItemButton, ListItemText } from '@mui/material';

import { ChangeStatusModal } from './changeStatusModal';

import styles from './manageLotStatusBlock.module.scss';

const { container, changeStatusBtn } = styles;

export const ManageLotStatusBlock = ({ ...lot }) => {
  const { innerStatus } = lot;
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(innerStatus);

  const handleClickListItem = () => {
    setIsOpen(true);
  };

  const handleClose = (newValue) => {
    setIsOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  };

  return (
    <div className={container}>
      <ListItemButton
        className={changeStatusBtn}
        aria-haspopup="true"
        aria-controls="lotStatus-menu"
        aria-label="lotStatus"
        onClick={handleClickListItem}
      >
        <ListItemText primary="Change lot status" />
      </ListItemButton>

      <ChangeStatusModal
        id="lotStatus-menu"
        keepMounted
        isOpen={isOpen}
        onClose={handleClose}
        value={value}
        lot={lot}
      />
    </div>
  );
};
