import { DateTime } from 'luxon';

export const getCorrectedTimeZone = (baseDate, correctedDate) => {
  const base = DateTime.fromISO(baseDate);
  const corrected = DateTime.fromISO(correctedDate);

  const adjustedCurrentDate = corrected.setZone(base.zoneName);

  return adjustedCurrentDate.toISO();
};
