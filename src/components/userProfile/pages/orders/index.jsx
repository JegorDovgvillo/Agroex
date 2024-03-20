import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import _ from 'lodash';

import { fetchUserActivityLots } from '@thunks/fetchLots';
import { lotListSelector } from '@slices/lotListSlice';

import { getLotState } from '@helpers/lotHandlers/getLotState';

import ItemCard from '@components/itemCard';

const UserOrders = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.usersList.userInfo);
  const lots = useSelector(lotListSelector);

  const filteredLotsByActiveTab = _.filter(lots, (item) => {
    const { isAuctionLot, isLotFinished } = getLotState(item);

    return !isAuctionLot && isLotFinished;
  });

  const filteredLotsArr = filteredLotsByActiveTab.map((item) => {
    return <ItemCard item={item} key={item.id} />;
  });

  useEffect(() => {
    if (!userInfo) {
      return;
    }

    const { id } = userInfo;

    dispatch(fetchUserActivityLots({ userId: id }));
  }, [dispatch, userInfo]);

  return <div>{filteredLotsArr} </div>;
};

export default UserOrders;
