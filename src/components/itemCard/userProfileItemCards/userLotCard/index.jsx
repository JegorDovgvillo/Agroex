import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import _ from 'lodash';

import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { CustomButton } from '@buttons/CustomButton';
import PriceBlock from '@components/priceBlock';
s;
import getNumberWithCurrency from '@helpers/getNumberWithCurrency';

import ItemCardInfoBlock from '../../itemCardInfo';
import ManageCardBlock from '../manageCardBlock';
import LotStatusBlock from '../lotStatusBlock';

import styles from '../../itemCard.module.scss';

const { priceBlock, priceContainer, pending, inactive, adminComment } = styles;

const UserLotCard = (item) => {
  const { tab } = useParams();

  const [lotStatus, setLotStatus] = useState(null);

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

  useEffect(() => {
    tab === 'pending' && setLotStatus(item.innerStatus);
  }, [tab]);

  const isAuctionLotType = item.lotType === 'auctionSell';

  const isLotEditable =
    (isAuctionLotType && item.innerStatus === 'new') ||
    (!isAuctionLotType && item.status !== 'inactive');

  return (
    <div className={styles.cardWrapp}>
      <ItemCardInfoBlock item={item}>
        <>
          {lotStatus && <LotStatusBlock lotStatus={lotStatus} />}
          {isLotEditable && <ManageCardBlock id={item.id} />}
        </>
      </ItemCardInfoBlock>
      <div className={containerClassNames}>
        <div className={priceBlock}>
          {isAuctionLotType && (
            <PriceBlock
              className={['list', 'auctionSum']}
              totalCost={item.price}
              unitCost={item.price / item.quantity}
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
        {isAuctionLotType && (
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
