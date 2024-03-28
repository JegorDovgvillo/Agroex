import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

import NotificationMessage from '../notificationMessage';

import styles from './notifications.module.scss';

const Notifications = () => {
  const iconRef = useRef(null);

  const [active, setIsActive] = useState(false);

  const messages = useSelector((state) => state.sse.messages);
  const userInfo = useSelector((state) => state.usersList.userInfo);

  const maxMessages = 9;
  const isVisible = active ? styles.visible : styles.invisible;
  const messageAmount =
    !_.isEmpty(messages) && messages.length > maxMessages
      ? `${maxMessages}+`
      : messages.length;

  const toggleNotifications = () => {
    setIsActive((active) => !active);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (iconRef.current && !iconRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      {userInfo && (
        <div className={styles.container} ref={iconRef}>
          <div className={styles.icon}>
            <NotificationsNoneIcon onClick={toggleNotifications} />
            <span>{!_.isEmpty(messages) ? messageAmount : null}</span>
          </div>
          <div className={isVisible}>
            {messages.map((item) => (
              <NotificationMessage
                key={item.id}
                id={item.id}
                lotId={item.lotId}
                title={item.title}
                message={item.message}
                sendTime={item.sendTime}
                messageType={item.type}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Notifications;
