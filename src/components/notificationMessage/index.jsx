import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate, generatePath } from 'react-router-dom';

import { markAsRead } from '@thunks/sse';
import { fetchLotDetails } from '@thunks/fetchLots';

import { deleteMessage, markAMessageAsRead } from '@slices/sseSlice';
import { getSelectedCurrency } from '@slices/currencySlice';

import ROUTES from '@helpers/routeNames';
import getFormattedDate from '@helpers/getFormattedDate';

import { CustomButton } from '../buttons/CustomButton';

import getMessageType from './messageTypes';
import styles from './notificationMessage.module.scss';

const NotificationMessage = ({
  id,
  title,
  message,
  lotId,
  sendTime,
  messageType,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isRead, setIsRead] = useState(false);

  const selectedCurrency = useSelector(getSelectedCurrency);
  const userInfo = useSelector((state) => state.usersList.userInfo);

  const isDisabled = isRead ? styles.disabled : styles.active;
  const buttonText = isRead ? 'Was read' : 'Mark as read';
  const messageIcon = getMessageType(messageType);
  const messageTime = getFormattedDate({
    date: sendTime,
    timeZone: userInfo.zoneinfo,
  });

  const checkMessage = () => {
    dispatch(markAsRead(id));
    dispatch(markAMessageAsRead(id));
    setIsRead(true);
  };

  const goToTheLotPage = () => {
    dispatch(fetchLotDetails({ id: lotId, currency: selectedCurrency }));

    const path = generatePath(ROUTES.LOTS_DETAILS, {
      id: lotId,
    });

    if (isRead) {
      dispatch(deleteMessage(id));
    }

    navigate(path);
  };

  return (
    <>
      <div className={styles.message} key={id}>
        <div className={styles.titleBlock}>
          <div className={styles.title}>
            {messageIcon}
            <h6 className={isDisabled}>{title}</h6>
          </div>
          <p className={isDisabled}>{messageTime}</p>
        </div>
        <p className={isDisabled}> {message} </p>
        <div className={styles.buttonsWrapp}>
          <CustomButton
            handleClick={checkMessage}
            text={buttonText}
            size="M"
            type="secondary"
            disabled={isRead}
          />
          <CustomButton
            handleClick={goToTheLotPage}
            text="Go to the lot"
            size="M"
            type="secondary"
          />
        </div>
      </div>
    </>
  );
};

export default NotificationMessage;
