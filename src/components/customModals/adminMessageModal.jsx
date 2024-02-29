import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { toggleModal } from '@slices/modalSlice';
import { selectModalState } from '@slices/modalSlice';

const AdminMessageModal = ({ setAdminMessage }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) =>
    selectModalState(state, 'adminMessageModal')
  );

  const handleClose = () => {
    dispatch(toggleModal('adminMessageModal'));
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            handleClose();

            setAdminMessage(event.target.message.value);
          },
        }}
      >
        <DialogTitle>Reject reason</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            required
            margin="dense"
            id="message"
            name="message"
            label=""
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminMessageModal;
