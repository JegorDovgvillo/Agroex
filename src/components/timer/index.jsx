import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

import { getCorrectedTimeZone } from '@helpers/getCorrectTime';

import { TimeCountDown } from '../timeCountDown';

const Timer = ({ endDate, userTimeZone }) => {
  const [timeNow, setTimeNow] = useState({
    value: getCorrectedTimeZone(DateTime.now(), userTimeZone),
  });

  useEffect(() => {
    const timeoutId = setInterval(() => {
      setTimeNow({ value: getCorrectedTimeZone(DateTime.now(), userTimeZone) });
    }, 1000);

    return () => clearInterval(timeoutId);
  }, [timeNow]);

  return <TimeCountDown startDate={timeNow.value} endDate={endDate} />;
};

export default Timer;
