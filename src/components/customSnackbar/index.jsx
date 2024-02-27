import { useDispatch, useSelector } from 'react-redux';

import { Snackbar, Alert } from '@mui/material';

import { toggleModal } from '@slices/modalSlice';
import { selectModalState } from '@slices/modalSlice';

// severity could be "success", "info", "warning", "error"

export const CustomSnackbar = ({ message, severity }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => selectModalState(state, 'snackbar'));

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(toggleModal('snackbar'));
  };

  return (
    <div>
      <Snackbar
        open={isOpen}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="outlined"
          sx={{ bgcolor: 'background.paper', width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};
