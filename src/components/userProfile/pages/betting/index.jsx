import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchLots } from '@thunks/fetchLots';
import { lotListSelector } from '@slices/lotListSlice';

import BettingCard from '@components/itemCard/userProfileItemCards/bettingCard';

const Betting = () => {
  //todo add filter by lot status (active, pending, inactive)

  const currUserId = 1; // todo should be replaced by real current user id
  const dispatch = useDispatch();
  const lots = useSelector(lotListSelector); // todo could be get already filtered from back-end endpoint

  useEffect(() => {
    dispatch(fetchLots());
  }, [dispatch]);

  const filteringLotsByUserId = () => {
    const filteredLots = lots
      .filter((item) => item.userId === currUserId)
      .map((item) => {
        return <BettingCard {...item} key={item.id} />;
      });

    return <>{filteredLots}</>;
  };

  const filteredLots = filteringLotsByUserId();

  return <div>{filteredLots}</div>;
};

export default Betting;
