import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import _ from 'lodash';

import { fetchUserActivityLots, fetchLotDetails } from '@thunks/fetchLots';
import { getUserFromCognito } from '@thunks/fetchUsers';
import { lotListSelector } from '@slices/lotListSlice';
import { betsSelector } from '@slices/betsSlice';
import { selectModal } from '@slices/modalSlice';

import PlaceBetModal from '@customModals/placeBetModal';
import ItemCard from '@components/itemCard';

import { handlePlaceNewBet } from '@helpers/lotHandlers';

const Betting = () => {
  const { tab } = useParams();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.usersList.userInfo);
  const [currUserId, setCurrUserId] = useState(null);
  const lots = useSelector(lotListSelector);
  const bets = useSelector(betsSelector);
  const [selectedLot, setSelectedLot] = useState(null);

  const confirmModalData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );
  const newBet = useSelector((state) => state.bets.newBet);

  const filteredLotsByActiveTab = _.filter(lots, (item) => {
    const isAuctionLot = item.lotType === 'auctionSell';
    const isActiveLotStatus = item.status === 'active';
    const lastBet = _.maxBy(item.bets, 'id');
    const isLotOutbid = lastBet?.userId !== currUserId;
    const isFinishedLotStatus = item.status === 'finished';

    switch (tab) {
      case 'active':
        return isAuctionLot && isActiveLotStatus && !isLotOutbid;

      case 'outbid':
        return isAuctionLot && isActiveLotStatus && isLotOutbid;

      case 'finished':
        return isAuctionLot && isFinishedLotStatus;
    }
  });

  const filteredLotsArr = filteredLotsByActiveTab.map((item) => {
    return (
      <ItemCard item={item} setSelectedLot={setSelectedLot} key={item.id} />
    );
  });

  useEffect(() => {
    dispatch(getUserFromCognito());
  }, [dispatch]);

  useEffect(() => {
    if (!userInfo) {
      return;
    }

    const { id } = userInfo;
    setCurrUserId(id);
    dispatch(fetchUserActivityLots({ userId: id }));
  }, [dispatch, userInfo]);

  useEffect(() => {
    const { confirmStatus, action, isOpen } = confirmModalData;

    if (!isOpen && action === 'placeBet') {
      confirmStatus && newBet && handlePlaceNewBet(dispatch, newBet);
    }
  }, [confirmModalData]);

  useEffect(() => {
    if (!_.isEmpty(bets)) {
      const lastBet = _.maxBy(bets, 'id');
      dispatch(fetchLotDetails(lastBet.lotId));
    }
  }, [bets]);

  return (
    <>
      <div>{filteredLotsArr}</div>
      {selectedLot && (
        <PlaceBetModal lot={selectedLot} setSelectedLot={setSelectedLot} />
      )}
    </>
  );
};

export default Betting;
