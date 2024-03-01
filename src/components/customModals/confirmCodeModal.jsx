import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, TextField, Box } from '@mui/material';
import { confirmUserAttribute } from 'aws-amplify/auth';

import { updateToken, updateUser } from '@thunks/fetchUsers';

import { selectModalState, toggleModal } from '@slices/modalSlice';

import { CustomButton } from '../buttons/CustomButton';

import styles from './infoModal.module.scss';

const ConfirmCodeModal = ({ values, sub, zoneinfo }) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState('');

  const isOpen = useSelector((state) =>
    selectModalState(state, 'updatingModal')
  );

  const handleSubmitClick = async () => {
    await confirmUserAttribute({
      userAttributeKey: 'email',
      confirmationCode: value,
    });

    const updateDataUser = {
      ...values,
      username: values.name,
      zoneinfo,
    };

    dispatch(updateToken());
    dispatch(updateUser({ id: sub, userData: updateDataUser }));
    dispatch(toggleModal('updatingModal'));
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => {
          dispatch(toggleModal('updatingModal'));
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.wrapp} sx={{ gap: '30px' }}>
          <h2 className={styles.title}>Enter the your code</h2>
          <TextField
            id="outlined-basic"
            label="Code"
            variant="outlined"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <CustomButton
            text="Confirm"
            size="L"
            type="primary"
            typeOfButton="button"
            disabled={false}
            icon={null}
            width={null}
            handleClick={handleSubmitClick}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default ConfirmCodeModal;
