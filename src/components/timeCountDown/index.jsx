import { DateTime } from 'luxon';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import styles from './time.module.scss';
const { container, expired, time } = styles;

export const TimeCountDown = ({ startDate, endDate }) => {
  const end = DateTime.fromISO(endDate);
  const start = DateTime.fromISO(startDate);

  const isStartDateAfterEndDate = start.diff(end).milliseconds > 0;

  const duration = end.diff(start, ['days', 'hours', 'minutes']).toObject();
  const { days, hours, minutes } = duration;

  return (
    <div className={`${container} ${isStartDateAfterEndDate && expired}`}>
      <AccessTimeIcon className={time} />
      {isStartDateAfterEndDate && (
        <>
          <span>expired</span>
          <span className={time}>{`${-days}d `}</span>
          <span className={time}>{`${Math.floor(-hours)}h `}</span>

          <span className={time}>{`${Math.floor(-minutes)}m `}</span>
          <span>ago</span>
        </>
      )}
      {!isStartDateAfterEndDate && (
        <>
          <span className={styles}>{`${days}d `}</span>
          <span className={time}>{`${Math.floor(hours)}h `}</span>
          <span className={time}>{`${Math.floor(minutes)}m `}</span>
        </>
      )}
    </div>
  );
};
