import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useNavigate, generatePath } from 'react-router-dom';

import { markAsRead } from '@thunks/sse';

import ROUTES from '@helpers/routeNames';

import { CustomButton } from '../buttons/CustomButton';

import styles from './notificationMessage.module.scss';

const NotificationMessage = ({ id, title, message, lotId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [disabled, setDisabled] = useState(false);

  const isDisabled = disabled ? styles.disabled : styles.active;
  const buttonText = disabled ? 'Was read' : 'Check as read';

  const checkMessage = () => {
    dispatch(markAsRead(id));
    setDisabled(true);
  };

  const goToTheLotPage = () => {
    const path = generatePath(ROUTES.LOTS_DETAILS, {
      id: lotId,
    });

    navigate(path);
  };

  return (
    <>
      <div className={styles.message} key={id}>
        <div className={styles.titleBlock}>
          <h6 className={isDisabled}>{title}</h6>
          <p>27.03.2024 13:48</p>
        </div>
        <p className={isDisabled}> {message} </p>
        <div className={styles.buttonsWrapp}>
          <CustomButton
            handleClick={checkMessage}
            text={buttonText}
            size="M"
            type="secondary"
            disabled={disabled}
          />
          <CustomButton
            handleClick={goToTheLotPage}
            text="Go to"
            size="M"
            type="secondary"
          />
        </div>
      </div>
    </>
  );
};

export default NotificationMessage;
