import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import {
  closeConfirmModal,
  closeConfirmNestedModal,
} from '@store/slices/modalSlice';

const ConfirmActionModal = ({ text, setConfirmStatus, isNested = false }) => {
  const dispatch = useDispatch();
  const open = isNested
    ? useSelector((state) => state.modal.confirmNestedModalIsOpen)
    : useSelector((state) => state.modal.confirmModalIsOpen);

  const handleCloseDisagree = () => {
    setConfirmStatus(false);
    isNested
      ? dispatch(closeConfirmNestedModal())
      : dispatch(closeConfirmModal());
  };
  const handleCloseAgree = () => {
    setConfirmStatus(true);
    isNested
      ? dispatch(closeConfirmNestedModal())
      : dispatch(closeConfirmModal());
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDisagree}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDisagree} variant='outlined' color='error'>
          No
        </Button>
        <Button onClick={handleCloseAgree} variant='contained' autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmActionModal;
