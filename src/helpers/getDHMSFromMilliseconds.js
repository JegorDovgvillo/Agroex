import { Duration } from 'luxon';

export const getDHMSFromMilliseconds = (milliseconds) => {
  const duration = Duration.fromMillis(milliseconds);

  const hoursPerDay = 24;
  const minutesPerHour = 60;
  const secondsPerMinute = 60;

  let days = Math.floor(duration.as('days'));
  let hours = Math.floor(duration.as('hours')) % hoursPerDay;
  let minutes = Math.floor(duration.as('minutes')) % minutesPerHour;
  let seconds = Math.floor(duration.as('seconds')) % secondsPerMinute;

  return { days, hours, minutes, seconds };
};
