import { useDispatch, useSelector } from 'react-redux';

import { Snackbar, Alert } from '@mui/material';

import { toggleModal } from '@slices/modalSlice';
import { selectModal } from '@slices/modalSlice';

import styles from './customSnackbar.module.scss';

const { alert } = styles;
// severity could be "success", "info", "warning", "error"

export const CustomSnackbar = () => {
  const dispatch = useDispatch();
  const customSnackbarData = useSelector((state) =>
    selectModal(state, 'snackbar')
  );
  const { isOpen, title, message, severity } = customSnackbarData;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(toggleModal('snackbar'));
  };

  return (
    <div>
      {message && (
        <Snackbar
          open={isOpen}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={handleClose}
        >
          <Alert
            className={`${alert} ${styles[severity]}`}
            onClose={handleClose}
            severity={severity}
            variant="outlined"
          >
            {title && <AlertTitle>Info</AlertTitle>}
            {message}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};
