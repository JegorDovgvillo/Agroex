import { DateTime } from "luxon";
import timeIcon from "../../assets/icons/time.svg";
import styles from "./time.module.scss";

export const TimeCountDown = ({ startDate, endDate }) => {
  const end = DateTime.fromISO(endDate);
  const start = DateTime.fromISO(startDate);

  const duration = end.diff(start, ["days", "hours"]).toObject();
  const { days, hours } = duration;

  return (
    <div className={styles.container}>
      <img src={timeIcon} alt="Watch icon"></img>
      {days >= 1 && <span className={styles.time}>{`${days}d `}</span>}
      {hours >= 1 && (
        <span className={styles.time}>{`${Math.floor(hours)}h `}</span>
      )}
    </div>
  );
};
