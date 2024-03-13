import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import _ from 'lodash';

import { getUserFromCognito } from '@thunks/fetchUsers';
import { fetchUserActivityLots } from '@thunks/fetchLots';
import { lotListSelector } from '@slices/lotListSlice';

import { getLotState } from '@helpers/lotHandlers/getLotState';

import ItemCard from '@components/itemCard';

const UserOrders = () => {
  const { tab } = useParams();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.usersList.userInfo);
  const lots = useSelector(lotListSelector);

  const filteredLotsByActiveTab = _.filter(lots, (item) => {
    const { isAuctionLot, isLotFinished } = getLotState(item);

    switch (tab) {
      case 'finished':
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
