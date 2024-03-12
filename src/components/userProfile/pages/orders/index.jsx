import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import _ from 'lodash';

import { fetchUserActivityLots } from '@thunks/fetchLots';
import { lotListSelector } from '@slices/lotListSlice';

import { getUserFromCognito } from '@thunks/fetchUsers';

import ItemCard from '@components/itemCard';

const UserOrders = () => {
  const { tab } = useParams();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.usersList.userInfo);
  const lots = useSelector(lotListSelector);

  const filteredLotsByActiveTab = _.filter(lots, (item) => {
    const isAuctionLot = item.lotType === 'auctionSell';
    const isLotFinished = item.status === 'finished';

    switch (tab) {
      case 'active':
        return !isAuctionLot && isLotFinished;
    }
  });

  const filteredLotsArr = filteredLotsByActiveTab.map((item) => {
    return <ItemCard item={item} key={item.id} />;
  });

  useEffect(() => {
    dispatch(getUserFromCognito());
  }, [dispatch]);

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
