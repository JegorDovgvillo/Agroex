import { useSelector, useDispatch } from 'react-redux';

import { getFetchResultMessages } from '@helpers/getFetchResultMessages';

import { setModalFields } from '@slices/modalSlice';
import { createCategory } from '@thunks/fetchCategories';

const { successCategoryCreate } = getFetchResultMessages();

export function useCreateCategory() {
  const dispatch = useDispatch();
  const { loadingStatus, errors } = useSelector((state) => state.categories);

  return async ({ dataCategory }) => {
    await dispatch(createCategory({ dataCategory }));

    if (!loadingStatus && !errors) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: successCategoryCreate,
          severity: 'success',
          isOpen: true,
        })
      );

      return !loadingStatus && !errors;
    }
  };
}
