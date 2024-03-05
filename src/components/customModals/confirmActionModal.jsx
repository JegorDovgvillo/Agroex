import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { toggleModal, selectModalState } from '@slices/modalSlice';

const ConfirmActionModal = ({
  text,
  setConfirmStatus,
  modalType = 'confirmModal',
}) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => selectModalState(state, modalType));

  const handleCloseDisagree = (event) => {
    event.stopPropagation();
    setConfirmStatus(false);
    dispatch(toggleModal(modalType));
  };

  const handleCloseAgree = (event) => {
    event.stopPropagation();
    setConfirmStatus(true);
    dispatch(toggleModal(modalType));
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDisagree}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDisagree} variant="outlined" color="error">
          No
        </Button>
        <Button onClick={handleCloseAgree} variant="contained" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmActionModal;
