import { useDispatch, useSelector } from 'react-redux';

import { Dialog, Box } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';

import { PlaceBetForm } from '@components/placeBetForm';
import { CloseButton } from '@buttons/CloseButton';

import { toggleModal, selectModalState } from '@slices/modalSlice';

import styles from './placeBetModal.module.scss';

const { headerForm } = styles;

const PlaceBetModal = ({ lot, setSelectedLot }) => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state) =>
    selectModalState(state, 'placeBetModal')
  );

  const handleClose = (event) => {
    event.stopPropagation();
    setSelectedLot(null);
    dispatch(toggleModal('placeBetModal'));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <Box>
          <div className={headerForm}>
            <h4>Place a bet</h4>
            <CloseButton size="M" type="clear" handleClick={handleClose} />
          </div>
          <PlaceBetForm lot={lot} type="modal" />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PlaceBetModal;
