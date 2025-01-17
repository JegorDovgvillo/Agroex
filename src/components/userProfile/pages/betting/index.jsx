import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import _ from 'lodash';

import { fetchUserActivityLots, fetchLotDetails } from '@thunks/fetchLots';
import { lotListSelector } from '@slices/lotListSlice';
import { betsSelector } from '@slices/betsSlice';
import { selectModal } from '@slices/modalSlice';
import { getSelectedCurrency } from '@slices/currencySlice';

import PlaceBetModal from '@customModals/placeBetModal';
import ItemCard from '@components/itemCard';

import { getLotState } from '@helpers/lotHandlers/getLotState';
import { usePlaceNewBet } from '@helpers/customHooks/betsHooks';

const Betting = () => {
  const { tab } = useParams();
  const dispatch = useDispatch();
  const placeNewBet = usePlaceNewBet();
  const userInfo = useSelector((state) => state.usersList.userInfo);
  const [currUserId, setCurrUserId] = useState(null);
  const lots = useSelector(lotListSelector);
  const bets = useSelector(betsSelector);
  const selectedCurrency = useSelector(getSelectedCurrency);
  const [selectedLot, setSelectedLot] = useState(null);

  const confirmModalData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );
  const newBet = useSelector((state) => state.bets.newBet);

  const filteredLotsByActiveTab = _.filter(lots, (item) => {
    const { isAuctionLot, isActiveLot, lastBet, isLotFinished } =
      getLotState(item);
    const isLotOutbid = lastBet?.userId !== currUserId;

    switch (tab) {
      case 'active':
        return isAuctionLot && isActiveLot && !isLotOutbid;

      case 'outbid':
        return isAuctionLot && isActiveLot && isLotOutbid;

      case 'finished':
        return isAuctionLot && isLotFinished;
    }
  });

  const filteredLotsArr = filteredLotsByActiveTab.map((item) => {
    return (
      <ItemCard item={item} setSelectedLot={setSelectedLot} key={item.id} />
    );
  });

  useEffect(() => {
    if (!userInfo) {
      return;
    }

    const { id } = userInfo;

    setCurrUserId(id);
    dispatch(fetchUserActivityLots({ userId: id, currency: selectedCurrency }));
  }, [dispatch, userInfo, selectedCurrency]);

  useEffect(() => {
    const { confirmStatus, action, isOpen } = confirmModalData;

    if (!isOpen && action === 'placeBet') {
      confirmStatus &&
        newBet &&
        placeNewBet(newBet, selectedLot.originalCurrency);
    }
  }, [confirmModalData]);

  useEffect(() => {
    if (!_.isEmpty(bets)) {
      const lastBet = _.maxBy(bets, 'id');
      dispatch(
        fetchLotDetails({ id: lastBet.lotId, currency: selectedCurrency })
      );
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
