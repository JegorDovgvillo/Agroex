import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { includes, find, filter } from 'lodash';

import {
  getFilteredLots,
  changeLotStatusByUser,
  deleteLot,
} from '@thunks/fetchLots';

import { lotListSelector } from '@slices/lotListSlice';
import { selectModal, clearModalsFields } from '@slices/modalSlice';

import ItemCard from '@components/itemCard';

const UserLots = () => {
  const { tab } = useParams();
  const dispatch = useDispatch();
  const currUserId = useSelector((state) => state.usersList.userId);
  const lots = useSelector(lotListSelector);
  const confirmModalData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );

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
      dispatch(getFilteredLots({ status: 'all', users: currUserId }));
  }, [dispatch, currUserId]);

  useEffect(() => {
    const { confirmStatus, action, isOpen } = confirmModalData;
    const lot = find(lots, { id: action.lotId });

    if (!isOpen && confirmStatus) {
      switch (action.name) {
        case 'toggleUserLotStatus':
          dispatch(
            changeLotStatusByUser({
              lotId: lot.id,
              isActive: lot.userStatus === 'active' ? false : true,
            })
          );
          dispatch(clearModalsFields('confirmModal'));
          break;

        case 'deleteLot':
          dispatch(deleteLot({ id: action.lotId }));
          dispatch(clearModalsFields('confirmModal'));
          break;
      }
    }
  }, [confirmModalData]);

  return <div>{filteredLotsArr} </div>;
};

export default UserLots;
