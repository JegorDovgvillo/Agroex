import _ from 'lodash';

export const getLotState = (lot) => {
  const isAuctionLot = lot.lotType === 'auctionSell';
  const isNewLot = lot.innerStatus === 'new';
  const isLotTransaction = !_.isEmpty(lot.bets);
  const isLotFinished = lot.status === 'finished';
  const isLotExpired = !isLotTransaction && isLotFinished;
  const isRejectedByAdminLot = lot.innerStatus === 'rejected';
  const isDeactivatedByUser = lot.userStatus === 'inactive';
  const lastBet = isLotTransaction && _.maxBy(lot.bets, 'id');
  const isActiveLot = lot.status === 'active';

  return {
    isAuctionLot,
    isNewLot,
    isLotTransaction,
    isLotFinished,
    isLotExpired,
    isRejectedByAdminLot,
    isDeactivatedByUser,
    lastBet,
    isActiveLot,
  };
};
