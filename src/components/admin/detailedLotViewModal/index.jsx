import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { fetchUser } from '@store/thunks/fetchUsers';
import { fetchLotDetails } from '@store/thunks/fetchLots';
import { selectUserById } from '@store/slices/usersListSlice';
import { toggleModal, selectModalState } from '@store/slices/modalSlice';
import { selectLotDetailById } from '@store/slices/lotListSlice';

import AdminDetailedLotView from '../adminDetailedLotView';
import ConfirmActionModal from '../../customModals/confirmActionModal';

import styles from './detailedLotViewModal.module.scss';

const { dialog } = styles;

const DetailedLotViewModal = ({ handleChangeLot }) => {
  const dispatch = useDispatch();
  const { lotId } = useSelector((state) => state.lotList);
  const lot = useSelector((state) => selectLotDetailById(state, lotId));
  const open = useSelector((state) => selectModalState(state, 'infoModal'));
  const { userId } = useSelector((state) => state.usersList);
  const userData = useSelector((state) => selectUserById(state, userId));
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchLotDetails(lotId));
    dispatch(fetchUser(userId));
  }, [dispatch, lotId, userId]);

  useEffect(() => {
    if (confirm) {
      handleChangeLot({ ...lot });
      setConfirm(false);
    }
  }, [handleChangeLot, confirm, lot]);

  const handleClose = () => {
    dispatch(toggleModal('infoModal'));
  };

  function handleChangeLotByAdmin() {
    dispatch(toggleModal('confirmNestedModal'));
  }

  return (
    <>
      {lot && userData && (
        <Dialog
          maxWidth="none"
          className={dialog}
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <AdminDetailedLotView lot={lot} userData={userData} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="error">
              Close
            </Button>
            <Button
              onClick={handleChangeLotByAdmin}
              variant="contained"
              autoFocus
            >
              {`${!lot.enabledByAdmin ? 'Enable' : 'Disable'} lot`}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <ConfirmActionModal
        text="This action changes the lot status. Do you confirm the action?"
        setConfirmStatus={setConfirm}
        isNested={true}
      />
    </>
  );
};

export default DetailedLotViewModal;
