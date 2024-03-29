import { useSelector, useDispatch } from 'react-redux';

import { getFetchResultMessages } from '@helpers/getFetchResultMessages';

import { clearModalsFields, setModalFields } from '@slices/modalSlice';
import { setNewBet } from '@slices/betsSlice';
import { fetchDeal } from '@thunks/fetchLots';
import { fetchPlaceBet } from '@thunks/fetchBets';

const { successPlaceBet, successPlaceDeal } = getFetchResultMessages();

export const usePlaceNewBet = () => {
  const dispatch = useDispatch();
  const { loadingStatus, errors } = useSelector((state) => state.bets);

  return async (newBet, currency) => {
    await dispatch(
      fetchPlaceBet({
        id: newBet.lotId,
        betData: newBet,
        currency,
      })
    );

    if (!loadingStatus && !errors) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: successPlaceBet,
          severity: 'success',
          isOpen: true,
        })
      );

      dispatch(setNewBet(null));
      dispatch(clearModalsFields(['confirmModal', 'placeBetModal']));
    }
  };
};

export const useFetchDeal = () => {
  const dispatch = useDispatch();
  const { loadingStatus, errors } = useSelector((state) => state.lotList);

  return async ({ lotId, userId, currency }) => {
    await dispatch(
      fetchDeal({
        values: { id: lotId, userId: userId },
        currency: currency,
      })
    );

    if (!loadingStatus && !errors) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: successPlaceDeal,
          severity: 'success',
          isOpen: true,
        })
      );

      dispatch(clearModalsFields('confirmModal'));
    }
  };
};
