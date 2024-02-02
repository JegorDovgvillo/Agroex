import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';

import { toggleModal } from '@store/slices/modalSlice';
import { selectModalState } from '@store/slices/modalSlice';

import ill from '@assets/icons/ill.png';

import styles from './infoModal.module.scss';

const InfoModal = ({
  title,
  text,
  style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  },
}) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => selectModalState(state, 'infoModal'));
  
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => {
          dispatch(toggleModal('infoModal'));
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.text}>
            {text}
            <img src={ill} />
          </p>
        </Box>
      </Modal>
    </div>
  );
};

export default InfoModal;
