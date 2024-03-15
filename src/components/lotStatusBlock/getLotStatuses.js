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

  isLotFinished && lotStatuses.push('finished');

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
      isLotExpired && lotStatuses.push('expired');

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
      break;
  }

  return lotStatuses;
};