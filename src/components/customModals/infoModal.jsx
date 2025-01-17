import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';

import { toggleModal } from '@slices/modalSlice';
import { selectModalState } from '@slices/modalSlice';

import ill from '@assets/icons/ill.png';

import styles from './infoModal.module.scss';

const InfoModal = ({ title, text }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => selectModalState(state, 'infoModal'));

  const handleClose = (event) => {
    event.stopPropagation();
    dispatch(toggleModal('infoModal'));
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.wrapp}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.text}>
            {text}
            <img src={ill} />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default InfoModal;
