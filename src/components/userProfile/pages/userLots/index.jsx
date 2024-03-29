import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { includes, find, filter } from 'lodash';

import { getFilteredLots } from '@thunks/fetchLots';

import { lotListSelector } from '@slices/lotListSlice';
import { selectModal, clearModalsFields } from '@slices/modalSlice';
import { getSelectedCurrency } from '@slices/currencySlice';

import ItemCard from '@components/itemCard';

import {
  useDeleteLot,
  useChangeLotStatusByUser,
} from '@helpers/customHooks/lotsHooks';

const UserLots = () => {
  const { tab } = useParams();
  const dispatch = useDispatch();
  const deleteLot = useDeleteLot();
  const changeLotStatusByUser = useChangeLotStatusByUser();
  const currUserId = useSelector((state) => state.usersList.userId);
  const lots = useSelector(lotListSelector);
  const confirmModalData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );
  const selectedCurrency = useSelector(getSelectedCurrency);

  const filteredLotsByActiveTab = filter(lots, (item) => {
    const isActiveLotStatus = item.status === 'active';
    const isPendingLotStatus =
      item.userStatus !== 'inactive' &&
      includes(['new', 'onModeration'], item.innerStatus);
    const isFinishedLotStatus = item.status === 'finished';
    const isInactiveLotStatus =
      !isActiveLotStatus && !isPendingLotStatus && !isFinishedLotStatus;

    switch (tab) {
      case 'active':
        return isActiveLotStatus;

      case 'pending':
        return isPendingLotStatus;

      case 'inactive':
        return isInactiveLotStatus;

      case 'finished':
        return isFinishedLotStatus;
    }
  });

  const filteredLotsArr = filteredLotsByActiveTab.map((item) => {
    return <ItemCard item={item} key={item.id} />;
  });

  useEffect(() => {
    currUserId &&
      dispatch(
        getFilteredLots({
          params: { status: 'all', users: currUserId },
          currency: selectedCurrency,
        })
      );
  }, [dispatch, currUserId, selectedCurrency]);

  useEffect(() => {
    const { confirmStatus, action, isOpen } = confirmModalData;
    const lot = find(lots, { id: action.lotId });

    if (!isOpen && confirmStatus) {
      switch (action.name) {
        case 'toggleUserLotStatus':
          changeLotStatusByUser({
            lotId: lot.id,
            isActive: lot.userStatus,
          });

          break;

        case 'deleteLot':
          deleteLot({ id: action.lotId });
          break;
      }
    }
  }, [confirmModalData]);

  return <div>{filteredLotsArr} </div>;
};

export default UserLots;
