import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { TimeCountDown } from '../timeCountDown';

const Timer = ({ endDate }) => {
  const [timeNow, setTimeNow] = useState({ value: DateTime.now().toISO() });

  useEffect(() => {
    const timeoutId = setInterval(() => {
      setTimeNow({ value: DateTime.now().toISO() });
    }, 1000);

    return () => clearInterval(timeoutId);
  }, [timeNow]);

  return <TimeCountDown startDate={timeNow.value} endDate={endDate} />;
};

export default Timer;
