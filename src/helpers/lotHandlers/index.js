import ROUTES from '@helpers/routeNames';

import {
  clearModalsFields,
  setModalFields,
  toggleModal,
} from '@slices/modalSlice';
import { setNewBet } from '@slices/betsSlice';

import {
  fetchDeal,
  changeLotStatusByUser,
  changeLotStatusByAdmin,
  deleteLot,
} from '@thunks/fetchLots';

import { fetchPlaceBet } from '@thunks/fetchBets';

export const handleDeactivateBtnClick = (dispatch, isAdmin = false) => {
  dispatch(
    setModalFields({
      modalId: 'confirmModal',
      text: 'This action changes the lot status. Do you confirm the action?',
      action: isAdmin ? 'deactivateLotByAdmin' : 'deactivateLot',
    })
  );
  dispatch(toggleModal('confirmModal'));
};

export const handleEditLotButtonClick = (navigate, lotId) => {
  navigate(ROUTES.UPDATE_LOT.replace(':id', lotId));
};

export const handleToggleUserLotStatusBtnClick = (dispatch, lotId) => {
  dispatch(
    setModalFields({
      modalId: 'confirmModal',
      text: 'This action changes the lot status. Do you confirm the action?',
      action: { name: 'toggleUserLotStatus', lotId: lotId },
    })
  );
  dispatch(toggleModal('confirmModal'));
};

export const handleDeleteBtnClick = (dispatch, lotId) => {
  dispatch(
    setModalFields({
      modalId: 'confirmModal',
      text: 'The lot will be permanently deleted. Are you sure?',
      action: { name: 'deleteLot', lotId: lotId },
    })
  );
  dispatch(toggleModal('confirmModal'));
};

export const handleDealBtnClick = (dispatch, isAuctionLot, lot, userId) => {
  dispatch(toggleModal('confirmModal'));

  if (isAuctionLot) {
    const valueToSubmit = {
      amount: lot.originalPrice,
      userId: userId,
      lotId: lot.id,
    };

    dispatch(setNewBet(valueToSubmit));
    dispatch(
      setModalFields({
        modalId: 'confirmModal',
        text: 'Do you confirm the max bid request?',
        action: 'placeBet',
      })
    );
  } else {
    dispatch(
      setModalFields({
        modalId: 'confirmModal',
        text: 'Do you confirm the deal request?',
        action: 'deal',
      })
    );
  }
};

export const handlePlaceNewBet = (dispatch, newBet, currency) => {
  dispatch(
    fetchPlaceBet({
      id: newBet.lotId,
      betData: newBet,
      currency,
    })
  );
  dispatch(setNewBet(null));
  dispatch(clearModalsFields(['confirmModal', 'placeBetModal']));
};

export const handleDeal = (params) => {
  const { dispatch, lotId, userId, currency } = params;

  dispatch(
    fetchDeal({
      values: { id: lotId, userId: userId },
      currency: currency,
    })
  );
  dispatch(clearModalsFields('confirmModal'));
};

export const handleDeactivateLot = (dispatch, lotId) => {
  dispatch(
    changeLotStatusByUser({
      lotId: lotId,
      isActive: false,
    })
  );
  dispatch(clearModalsFields('confirmModal'));
};

export const handleDeleteLot = (dispatch, lotId) => {
  dispatch(deleteLot({ id: lotId }));
  dispatch(clearModalsFields('confirmModal'));
};

export const handleChangeLotStatusByAdmin = async ({
  dispatch,
  lotId,
  status,
  adminMessage,
  selectedCurrency,
}) => {
  const resultAction = await dispatch(
    changeLotStatusByAdmin({
      lotId: lotId,
      status: status,
      adminComment: adminMessage,
      currency: selectedCurrency,
    })
  );

  dispatch(clearModalsFields(['adminMessageModal', 'confirmModal']));

  return changeLotStatusByAdmin.fulfilled.match(resultAction);
};

export const handleChangeLotStatusByUser = ({
  dispatch,
  lotId,
  userStatus,
}) => {
  dispatch(
    changeLotStatusByUser({
      lotId: lotId,
      isActive: userStatus === 'active' ? false : true,
    })
  );
  dispatch(clearModalsFields('confirmModal'));
};
