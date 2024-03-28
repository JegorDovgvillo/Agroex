import { useSelector } from 'react-redux';
import { every } from 'lodash';

export const useLoadedWithoutErrorsSelector = () => {
  return (sliceNames) => {
    const allSliceResults = sliceNames.map((sliceName) => {
      const { loadingStatus, errors } = useSelector(
        (state) => state[sliceName]
      );
      return !every(loadingStatus, errors);
    });

    return every(allSliceResults);
  };
};
