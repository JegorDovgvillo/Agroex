import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ROUTES from '@helpers/routeNames';
import { getFetchResultMessages } from '@helpers/getFetchResultMessages';

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
  createLot,
  updateLot,
} from '@thunks/fetchLots';

import { fetchPlaceBet } from '@thunks/fetchBets';

const { successLotCreate, successLotUpdate, successLotDelete } =
  getFetchResultMessages();

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
