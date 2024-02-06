import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';

import { closeModal } from '@store/slices/modalSlice';

import styles from './customModal.module.scss';

const CustomModal = ({
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
  const isOpen = useSelector((state) => state.modal.isOpen);

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => {
          dispatch(closeModal());
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.text}>{text}</p>
        </Box>
      </Modal>
    </div>
  );
};

export default CustomModal;
