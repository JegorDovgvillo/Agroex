import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import _ from 'lodash';

import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { CustomButton } from '@buttons/CustomButton';
import PriceBlock from '@components/priceBlock';

import getNumberWithCurrency from '@helpers/getNumberWithCurrency';

import ItemCardInfoBlock from '../../itemCardInfo';
import ManageCardBlock from '../manageCardBlock';
import LotStatusBlock from '../lotStatusBlock';

import styles from '../../itemCard.module.scss';

const {
  priceBlock,
  priceContainer,
  pending,
  inactive,
  adminComment,
  pricesContainer,
  auctionSum,
} = styles;

const getLotStatuses = (tab, item, isLotTransaction) => {
  const lotStatuses = [];

  switch (tab) {
    case 'active':
      lotStatuses.push(item.lotType);
      break;

    case 'pending':
      lotStatuses.push(item.lotType, item.innerStatus);
      break;

    case 'inactive':
      lotStatuses.push(item.lotType, item.innerStatus, item.userStatus);
      isLotTransaction && lotStatuses.push('closed');
      break;
  }

  return lotStatuses;
};

const UserLotCard = (item) => {
  const { tab } = useParams();
  const current = DateTime.local().toISO();
  const expiration = item.expirationDate;

  const isLotExpired =
    DateTime.fromISO(current).diff(DateTime.fromISO(expiration)).milliseconds >
    0;
  const isAuctionLot = item.lotType === 'auctionSell';
  const isNewLot = item.innerStatus === 'new';
  const isLotTransaction = !_.isEmpty(item.bets);
  const isRejectedByAdminLot = item.innerStatus === 'rejected';
  const isDeactivatedByUserLot = item.userStatus === 'inactive';
  const lotStatuses = getLotStatuses(tab, item, isLotTransaction, isLotExpired);

  const getLotActions = () => {
    let actionsArr = [];

    if (
      (tab === 'active' && !isAuctionLot) ||
      (tab === 'pending' && isNewLot)
    ) {
      actionsArr = _.union(actionsArr, ['edit', 'deactivate']);
    }

    if (tab === 'inactive') {
      actionsArr =
        !isLotExpired &&
        isDeactivatedByUserLot &&
        _.union(actionsArr, ['activate']);
      actionsArr =
        !isLotExpired && isRejectedByAdminLot && _.union(actionsArr, ['edit']);
      actionsArr = !isLotTransaction && _.union(actionsArr, ['delete']);
    }

    return actionsArr;
  };

  const actions = getLotActions();

  //todo write confirm lot by user logic
  const handleClick = (event) => {
    event.stopPropagation();
  };

  const totalBet = getNumberWithCurrency(item.price, item.currency);

  const tabClasses = {
    [priceContainer]: true,
    [pending]: tab === 'pending',
    [inactive]: tab === 'inactive',
  };

  const containerClassNames = _.chain(tabClasses)
    .pickBy((isActive) => isActive)
    .keys()
    .join(' ')
    .value();

  const confirmButtonWidth = '306px';

  return (
    <div className={styles.cardWrapp}>
      <ItemCardInfoBlock item={item}>
        <>
          {!!lotStatuses.length && <LotStatusBlock lotStatuses={lotStatuses} />}
          {!!actions.length && (
            <ManageCardBlock id={item.id} actions={actions} />
          )}
        </>
      </ItemCardInfoBlock>
      <div className={containerClassNames}>
        <div className={pricesContainer}>
          <div className={priceBlock}>
            {_.isEmpty(item.bets) ? (
              <h6 className={auctionSum}>No bets</h6>
            ) : (
              <PriceBlock
                className={['list', 'auctionSum']}
                totalCost={item.bets.number}
                unitCost={item.bets.number / item.quantity}
                currency={item.currency}
              />
            )}
          </div>

          <div className={priceBlock}>
            <PriceBlock
              className={['list']}
              totalCost={item.price}
              unitCost={item.price / item.quantity}
              currency={item.currency}
            />
          </div>
        </div>

        {isAuctionLot && (
          <CustomButton
            size="L"
            text={`Confirm for ${totalBet}`}
            icon={<CheckIcon />}
            handleClick={handleClick}
            width={confirmButtonWidth}
          />
        )}
        {item.adminComment && (
          <div className={adminComment}>
            <ErrorOutlineIcon />
            {item.adminComment}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLotCard;
