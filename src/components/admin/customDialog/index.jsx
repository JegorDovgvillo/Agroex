import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useDispatch, useSelector } from 'react-redux';

import { closeModal } from '@store/slices/modalSlice';

const CustomDialog = ({ content, buttonsText, className }) => {
  const dispatch = useDispatch();

  const open = useSelector((state) => state.modal.isOpen);

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <>
      <Dialog
        className={className}
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{buttonsText.first}</Button>
          <Button onClick={handleClose} autoFocus>
            {buttonsText.second}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomDialog;
