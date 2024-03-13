import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import {
  toggleModal,
  selectModalState,
  setModalFields,
  clearModalsFields,
} from '@slices/modalSlice';

const ConfirmActionModal = ({ text }) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => selectModalState(state, 'confirmModal'));

  const handleCloseDisagree = (event) => {
    event.stopPropagation();
    dispatch(clearModalsFields('confirmModal'));
  };

  const handleCloseAgree = (event) => {
    event.stopPropagation();
    dispatch(
      setModalFields({
        modalId: 'confirmModal',
        confirmStatus: true,
      })
    );
    dispatch(toggleModal('confirmModal'));
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
