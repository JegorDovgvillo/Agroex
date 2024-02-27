import { replace, trim } from 'lodash';

const getSanitizedString = (str) => {
  return replace(trim(str), /\s+/g, ' ');
};

export default getSanitizedString;
