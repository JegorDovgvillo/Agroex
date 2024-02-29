import { Box, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import ROUTES from '@helpers/routeNames';

import { CustomButton } from '../buttons/CustomButton';

import styles from './infoModal.module.scss';

const ErrorModal = ({ title, text }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.wrapp} sx={{ gap: '15px' }}>
          <h2 className={styles.title}>{title}</h2>
          {text}
          <CustomButton
            text="Go to the page with lots"
            type="secondary"
            size="M"
            width="auto"
            handleClick={() => navigate(ROUTES.LOTS)}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default ErrorModal;
