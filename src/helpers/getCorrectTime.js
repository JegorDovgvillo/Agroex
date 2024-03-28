import { DateTime } from 'luxon';

export const getCorrectedTimeZone = (baseDate, timeZone) => {
  const base = DateTime.fromISO(baseDate);
  const rezoned = base.setZone(timeZone);

  return rezoned.toISO();
};

export const setCorrectedTimeZone = (baseDate, timeZone) => {
  const base = DateTime.fromISO(baseDate);
  const rezoned = base.setZone(timeZone, { keepLocalTime: true });
  console.log(baseDate, timeZone, rezoned.toISO());
  return rezoned.toISO();
};
