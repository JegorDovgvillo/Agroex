import { useSelector } from 'react-redux';
import { some, isEmpty } from 'lodash';

export const useLoadedWithoutErrorsSelector = (sliceNames) => {
  const isDataSlicesLoaded = sliceNames.map((sliceName) => {
    const sliceState = useSelector((state) => state[sliceName]);
    const { loadingStatus, errors } = sliceState;

    if (loadingStatus !== false) return null;

    return isEmpty(errors);
  });

  if (some(isDataSlicesLoaded, (item) => item === null)) {
    return null;
  }

  if (some(isDataSlicesLoaded, (item) => item === false)) {
    return false;
  }

  return true;
};
