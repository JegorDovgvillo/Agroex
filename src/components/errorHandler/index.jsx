import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';

import { setModalFields } from '@slices/modalSlice';

import { getErrorMessage } from '@helpers/getErrorMessage';

export const ErrorHandler = ({ states }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    states.map((state) => {
      const { errors, stateId } = state;
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
  }, []);

  return;
};
