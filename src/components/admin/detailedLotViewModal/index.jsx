import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { fetchUser } from '@store/thunks/fetchUsers';
import { selectUserById } from '@store/slices/usersListSlice';
import { openConfirmNestedModal } from '@store/slices/modalSlice';
import { closeInfoModal, openConfirmModal } from '@store/slices/modalSlice';
import { fetchLotDetails } from '@store/thunks/fetchLots';
import { selectLotDetailById } from '@store/slices/lotListSlice';

import AdminDetailedLotView from '../adminDetailedLotView';
import ConfirmActionModal from '../../customModals/confirmActionModal';

import styles from './detailedLotViewModal.module.scss';

const { dialog } = styles;

const DetailedLotViewModal = ({ handleChangeLot }) => {
  const dispatch = useDispatch();
  const { lotId } = useSelector((state) => state.lotList);
  const lot = useSelector((state) => selectLotDetailById(state, lotId));
  const open = useSelector((state) => state.modal.infoModalIsOpen);
  const { userId } = useSelector((state) => state.usersList);
  const userData = useSelector((state) => selectUserById(state, userId));
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchLotDetails(lotId));
    dispatch(fetchUser(userId));
  }, [fetchLotDetails, lotId, fetchUser, userId]);

  useEffect(() => {
    if (confirm) {
      handleChangeLot({ ...lot });
      setConfirm(false);
    }
  }, [confirm]);

  const handleClose = () => {
    dispatch(closeInfoModal());
  };

  function handleChangeLotByAdmin() {
    dispatch(openConfirmNestedModal());
  }

  return (
    <>
      {lot && userData && (
        <Dialog
          maxWidth='none'
          className={dialog}
          open={open}
          onClose={handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogContent>
            <AdminDetailedLotView lot={lot} userData={userData} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant='outlined' color='error'>
              Close
            </Button>
            <Button
              onClick={handleChangeLotByAdmin}
              variant='contained'
              autoFocus
            >
              {`${!lot.enabledByAdmin ? 'Enable' : 'Disable'} lot`}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <ConfirmActionModal
        text='This action deactivates the lot. Do you confirm the action?'
        setConfirmStatus={setConfirm}
        isNested={true}
      />
    </>
  );
};

export default DetailedLotViewModal;
