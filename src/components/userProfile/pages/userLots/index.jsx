import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { filteredLots } from '@thunks/fetchLots';
import { lotListSelector } from '@slices/lotListSlice';
import UserLotCard from '@components/itemCard/userProfileItemCards/userLotCard';

const UserLots = () => {
  const { tab } = useParams();

  const currUserId = 1; // todo should be replaced by real current user id
  const dispatch = useDispatch();
  const lots = useSelector(lotListSelector);

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

  useEffect(() => {
    const userParams = { users: currUserId };
    const params = new URLSearchParams(userParams).toString();

    dispatch(filteredLots(params));
  }, []);

  return <div>{filteredLotsArr} </div>;
};

export default UserLots;
