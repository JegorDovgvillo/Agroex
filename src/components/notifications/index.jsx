import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import styles from './notifications.module.scss';

import NotificationMessage from '../notificationMessage';

const Notifications = () => {
  const iconRef = useRef(null);

  const [active, setIsActive] = useState(false);

  const messages = useSelector((state) => state.sse.messages);

  const toggleNotifications = () => {
    setIsActive((active) => !active);
  };

  const isVisible = active ? styles.visible : styles.invisible;

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
    <div className={styles.container} ref={iconRef}>
      <div className={styles.icon}>
        <NotificationsNoneIcon onClick={toggleNotifications} />
        <span>{!_.isEmpty(messages) ? messages.length : null}</span>
      </div>
      <div className={isVisible}>
        {!_.isEmpty(messages) ? (
          messages.map((item) => (
            <NotificationMessage
              key={item.id}
              id={item.id}
              lotId={item.lotId}
              title={item.title}
              message={item.message}
            />
          ))
        ) : (
          <p>There are no new notifications here</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
