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

import { markAsRead } from '@thunks/sse';

import { toggleModal, setModalFields, selectModal } from '@slices/modalSlice';
import { getSelectedCurrency } from '@slices/currencySlice';
import { markAsReadFromLotId } from '@slices/sseSlice';

import { useChangeLotStatusByAdmin } from '@helpers/customHooks/lotsHooks';

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
  const changeLotStatusByAdmin = useChangeLotStatusByAdmin();
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
  const selectedCurrency = useSelector(getSelectedCurrency);
  const messages = useSelector((state) => state.sse.messages);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleMarkAsRead = (action) => {
    switch (action) {
      case 'markAsRead':
        _.chain(messages)
          .filter({ lotId: props.lot.id })
          .forEach((message) => {
            const messageId = message.id;
            dispatch(markAsRead(messageId));
            dispatch(markAsReadFromLotId(props.lot.id));
          });
        break;
    }
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
    const { confirmStatus, isOpen } = confirmModalData;

    if (!confirmStatus || isOpen) return;

    if (value === 'rejected') {
      dispatch(toggleModal('adminMessageModal'));
    } else {
      handleMarkAsRead('markAsRead');
      onClose(value);
      changeLotStatusByAdmin({
        lotId: lot.id,
        status: _.camelCase(value),
        adminMessage: null,
        selectedCurrency,
      });
    }
  }, [confirmModalData]);

  useEffect(() => {
    const { adminMessage } = adminMessageModalData;

    if (value === 'rejected' && adminMessage) {
      handleMarkAsRead('markAsRead');
      onClose(value);
      changeLotStatusByAdmin({
        lotId: lot.id,
        status: value,
        adminMessage: adminMessage,
        selectedCurrency,
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
