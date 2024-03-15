import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@mui/material';

import { CustomButton } from '@buttons/CustomButton';

import { toggleModal, setModalFields, selectModal } from '@slices/modalSlice';

import { handleChangeLotStatusByAdmin } from '@helpers/lotHandlers';

import styles from './manageLotStatusBlock.module.scss';

const { dialog } = styles;

const getStatusSelectOptions = (params) => {
  const { innerStatus } = params;

  switch (innerStatus) {
    case 'new':
      return ['on moderation', 'rejected', 'approved'];
    case 'onModeration':
      return ['rejected', 'approved'];
    case 'rejected':
      return ['on moderation', 'approved'];
    case 'approved':
      return ['on moderation', 'rejected'];
  }

  return ['new', 'on moderation', 'rejected', 'approved'];
};

export const ChangeStatusModal = (props) => {
  const dispatch = useDispatch();
  const { onClose, value: valueProp, isOpen, lot } = props;
  const [value, setValue] = useState(valueProp);
  const radioGroupRef = useRef(null);
  const options = getStatusSelectOptions(lot);

  const adminMessageModalData = useSelector((state) =>
    selectModal(state, 'adminMessageModal')
  );
  const confirmModalData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSave = () => {
    dispatch(
      setModalFields({
        modalId: 'confirmModal',
        text: 'This action changes the lot status. Do you confirm the action?',
      })
    );
    dispatch(toggleModal('confirmModal'));
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    if (!isOpen) {
      setValue(valueProp);
    }
  }, [valueProp, isOpen]);

  useEffect(() => {
    const { confirmStatus } = confirmModalData;

    if (!confirmStatus) return;

    if (value === 'rejected') {
      dispatch(toggleModal('adminMessageModal'));
    } else {
      onClose(value);
      handleChangeLotStatusByAdmin({
        dispatch,
        lotId: lot.id,
        status: _.camelCase(value),
        adminMessage: null,
      });
    }
  }, [confirmModalData]);

  useEffect(() => {
    const { adminMessage } = adminMessageModalData;

    if (value === 'rejected' && adminMessage) {
      onClose(value);
      handleChangeLotStatusByAdmin({
        dispatch,
        lotId: lot.id,
        status: value,
        adminMessage: adminMessage,
      });
    }
  }, [adminMessageModalData.adminMessage]);

  return (
    <Dialog
      className={dialog}
      TransitionProps={{ onEntering: handleEntering }}
      open={isOpen}
    >
      <DialogTitle>Lot Status</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="lotStatus"
          name="lotStatus"
          value={value}
          onChange={handleChange}
        >
          {options.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <CustomButton
          text="Cancel"
          handleClick={handleCancel}
          type="secondary"
          color="error"
          size="M"
          width="75px"
        />
        <CustomButton
          text="Save"
          handleClick={handleSave}
          type="secondary"
          size="M"
          width="120px"
        />
      </DialogActions>
    </Dialog>
  );
};
