import { useDispatch } from 'react-redux';
import _ from 'lodash';

import { setModalFields } from '@slices/modalSlice';

import { getErrorMessage } from '@helpers/getErrorMessage';

export const useErrorHandler = () => {
  const dispatch = useDispatch();

  return (states) => {
    states.map((state) => {
      const { errors } = state;
      const { title, message } = getErrorMessage(errors);

      dispatch(
        setModalFields({
          modalId: 'snackbar',
          title,
          message,
          severity: 'error',
          isOpen: true,
        })
      );
    });
  };
};
