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
  const lotStatuses = [];
  const isLotApproved = item.innerStatus === 'approved';

  switch (tab) {
    case 'active':
      lotStatuses.push(item.lotType);
      isLotFinished && !isLotExpired && lotStatuses.push(item.status);
      break;

    case 'pending':
      lotStatuses.push(item.lotType, item.innerStatus);
      break;

    case 'inactive':
      lotStatuses.push(item.lotType, item.innerStatus, item.userStatus);
      break;

    case 'finished':
      lotStatuses.push(item.lotType);
      isLotExpired && lotStatuses.push('expired');
      isLotFinished && !isLotExpired && lotStatuses.push(item.status);
      isAuctionLot &&
        !isUserLotOwner &&
        lotStatuses.push(isUserWinner ? 'won' : 'lose');
      break;

    case 'detailsPage':
      lotStatuses.push(item.lotType);
      isLotExpired && lotStatuses.push('expired');
      isLotFinished && !isLotExpired && lotStatuses.push(item.status);
      !isLotExpired &&
        !isLotFinished &&
        isLotApproved &&
        isAdmin &&
        lotStatuses.push(item.innerStatus);
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
      break;

    default:
      lotStatuses.push(item.lotType);
  }

  return lotStatuses;
};
