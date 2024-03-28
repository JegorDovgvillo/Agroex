import { useSelector } from 'react-redux';
import { some } from 'lodash';

export const useLoadedWithoutErrorsSelector = (sliceNames) => {
  const isDataSlicesLoaded = sliceNames.map((sliceName) => {
    const sliceState = useSelector((state) => state[sliceName]);
    const { loadingStatus, errors } = sliceState;
    console.log(sliceName, loadingStatus, errors);
    if (loadingStatus !== false) return null;

    return errors ? false : true;
  });
  console.log(isDataSlicesLoaded);
  if (some(isDataSlicesLoaded, (item) => item === null)) {
    return null;
  }

  if (some(isDataSlicesLoaded, (item) => item === false)) {
    return false;
  }

  return true;
};
