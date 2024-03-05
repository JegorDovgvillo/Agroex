import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { toggleModal, selectModalState } from '@slices/modalSlice';

const PlaceBetModal = ({ lot }) => {
  const dispatch = useDispatch();
  const modalType = 'placeBetModal';
  const isOpen = useSelector((state) => selectModalState(state, modalType));

  const handleClose = (event) => {
    event.stopPropagation();
    dispatch(toggleModal(modalType));
  };

  const handleBetClick = (event) => {
    event.stopPropagation();
    setConfirmStatus(true);
    dispatch(toggleModal(modalType));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      //aria-labelledby="alert-dialog-title"
      //aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          text
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBetClick} variant="contained" autoFocus>
          Bet
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlaceBetModal;
