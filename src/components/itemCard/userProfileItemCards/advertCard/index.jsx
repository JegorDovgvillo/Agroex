import { useParams } from 'react-router-dom';
import _ from 'lodash';

import CheckIcon from '@mui/icons-material/Check';

import { CustomButton } from '@buttons/CustomButton';
import PriceBlock from '@components/priceBlock';

import getNumberWithCurrency from '@helpers/getNumberWithCurrency';

import ItemCardInfoBlock from '../../itemCardInfo';
import ManageCardBlock from '../manageCardBlock';
import LotStatusBlock from '../lotStatusBlock';

import styles from '../../itemCard.module.scss';

const { priceBlock, priceContainer, pending, inactive } = styles;

const AdvertCard = (item) => {
  const { tab } = useParams();

  //todo replace the value of the const lotStatus by appropriate field from the lot
  const lotStatus = 'Rejected';

  //todo write confirm lot by user logic
  const handleClick = (event) => {
    event.stopPropagation();
  };

  // todo replace 'item.quantity * item.pricePerTon' by current bet
  const totalBet = getNumberWithCurrency(
    item.quantity * item.pricePerTon,
    item.currency
  );

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
          <LotStatusBlock lotStatus={lotStatus} />
          <ManageCardBlock />
        </>
      </ItemCardInfoBlock>
      <div className={containerClassNames}>
        <div className={priceBlock}>
          <PriceBlock
            className={['list', 'auctionSum']}
            totalCost={item.quantity * item.pricePerTon}
            unitCost={item.pricePerTon}
            currency={item.currency}
          />
        </div>

        <div className={priceBlock}>
          <PriceBlock
            className={['list']}
            totalCost={item.quantity * item.pricePerTon}
            unitCost={item.pricePerTon}
            currency={item.currency}
          />
        </div>
        <CustomButton
          size="L"
          text={`Confirm for ${totalBet}`}
          icon={<CheckIcon />}
          handleClick={handleClick}
          width={confirmButtonWidth}
        />
      </div>
    </div>
  );
};

export default AdvertCard;
