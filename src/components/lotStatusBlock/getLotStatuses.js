export const getLotStatuses = ({
  tab,
  item,
  isLotExpired,
  isLotFinished,
  isUserWinner,
  isAuctionLot,
  isUserLotOwner,
  isDeactivatedByUser,
  isAdmin = false,
}) => {
  const isLotApproved = item.innerStatus === 'approved';
  const lotStatuses = [item.lotType];

  switch (tab) {
    case 'pending':
      lotStatuses.push(item.innerStatus);
      break;

    case 'inactive':
      lotStatuses.push(item.innerStatus, item.userStatus);
      break;

    case 'finished':
      isLotExpired && lotStatuses.push('expired');
      isAuctionLot &&
        !isUserLotOwner &&
        lotStatuses.push(isUserWinner ? 'won' : 'lose');
      break;

    case 'detailsPage':
      isAdmin && lotStatuses.push(item.innerStatus);

      !isLotExpired &&
        !isLotFinished &&
        !isLotApproved &&
        lotStatuses.push(item.innerStatus);

      isLotFinished &&
        isAuctionLot &&
        !isUserLotOwner &&
        !isAdmin &&
        lotStatuses.push(isUserWinner ? 'won' : 'lose');

      isDeactivatedByUser && lotStatuses.push(item.userStatus);
      isLotExpired && lotStatuses.push('expired');
      break;
  }

  isLotFinished && lotStatuses.push('finished');

  return lotStatuses;
};
