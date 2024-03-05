import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getUserFromCognito } from '@thunks/fetchUsers';
import { filteredLots } from '@thunks/fetchLots';

import { lotListSelector } from '@slices/lotListSlice';

import UserLotCard from '@components/itemCard/userProfileItemCards/userLotCard';

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
    const isAuctionPendingLot =
      item.innerStatus === 'new' || item.innerStatus === 'moderated';

    switch (tab) {
      case 'active':
        return item.status === tab;

      case 'pending':
        return isAuctionPendingLot;

      case 'inactive':
        return item.status === 'inactive' && !isAuctionPendingLot;
    }
  });

  const filteredLotsArr = filteredLotsByActiveTab.map((item) => {
    return <UserLotCard {...item} key={item.id} />;
  });

  return <div>{filteredLotsArr} </div>;
};

export default UserLots;
