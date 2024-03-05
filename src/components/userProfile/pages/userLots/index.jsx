import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { includes } from 'lodash';

import { getUserFromCognito } from '@thunks/fetchUsers';
import { filteredLots } from '@thunks/fetchLots';

import { lotListSelector } from '@slices/lotListSlice';

import UserLotCard from '@components/itemCard/userProfileItemCards/userLotCard';
import ItemCard from '@components/itemCard';

const UserLots = () => {
  const { tab } = useParams();

  const dispatch = useDispatch();

  const currUserId = useSelector((state) => state.usersList.userId);
  const lots = useSelector(lotListSelector);

  const userParams = { users: currUserId };
  const params = new URLSearchParams(userParams).toString();

  useEffect(() => {
    dispatch(getUserFromCognito());
    currUserId && dispatch(filteredLots(params));
  }, [currUserId]);

  const filteredLotsByUserId = lots.filter(
    (item) => item.userId === currUserId
  );

  const filteredLotsByActiveTab = filteredLotsByUserId.filter((item) => {
    const isActiveLotStatus = item.status === 'active';
    const isPendingLotStatus =
      item.userStatus !== 'inactive' &&
      includes(['new', 'onModeration'], item.innerStatus);
    const isInactiveLotStatus = !isActiveLotStatus && !isPendingLotStatus;

    switch (tab) {
      case 'active':
        return isActiveLotStatus;

      case 'pending':
        return isPendingLotStatus;

      case 'inactive':
        return isInactiveLotStatus;
    }
  });

  const filteredLotsArr = filteredLotsByActiveTab.map((item) => {
    return <ItemCard {...item} key={item.id} />;
  });

  return <div>{filteredLotsArr} </div>;
};

export default UserLots;
