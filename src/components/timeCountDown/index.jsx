import { Box, Typography } from '@mui/material';
import timeIcon from '../../assets/icons/time.svg';
import styles from './time.module.scss';

export const TimeCountDown = ({ creationDateStr, expirationDateStr }) => {
  const creationDate = new Date(creationDateStr);
  const expirationDate = new Date(expirationDateStr);
  const durationMs = expirationDate - creationDate;
  const days = Math.floor(durationMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor(
    (durationMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
  );
  const minutes = Math.floor((durationMs % (60 * 60 * 1000)) / (60 * 1000));

  const getTimeStr = () =>
    days >= 1 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;

  const time = getTimeStr();

  return (
    <Box className={styles.container}>
      <img src={timeIcon} alt="Watch icon"></img>
      {time && <Typography className={styles.time}>{time}</Typography>}
    </Box>
  );
};
