import { compact } from 'lodash';

import { getDHMSFromMilliseconds } from '@helpers/getDHMSFromMilliseconds';

export const getFormattedDuration = (duration) => {
  if (!duration) {
    return '';
  }

  const { days, hours, minutes } = getDHMSFromMilliseconds(duration);

  const formattedDuration = compact([
    days > 0 && `${days}d`,
    hours > 0 && `${hours}h`,
    minutes > 0 && `${minutes}m`,
  ]).join(' ');

  return formattedDuration;
};
