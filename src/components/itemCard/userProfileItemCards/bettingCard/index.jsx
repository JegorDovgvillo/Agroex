import { useParams } from 'react-router-dom';

import GavelIcon from '@mui/icons-material/Gavel';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import { CustomButton } from '@buttons/CustomButton';
import PriceBlock from '@components/priceBlock';

import ItemCardInfoBlock from '../../itemCardInfo';
import ManageCardBlock from '../manageCardBlock';
import LotStatusBlock from '../lotStatusBlock';

import styles from '../../itemCard.module.scss';

const { cardWrapp, priceWrapp, userProfilePriceBlock } = styles;

const BettingCard = (item) => {
  const { tab } = useParams();

  //todo replace the value of the const lotStatus by appropriate field from the lot
  const lotStatus = 'Rejected';

  //todo write confirm lot by user logic
  const handleClick = (event) => {
    event.stopPropagation();
  };

  const tabClasses = {
    list: true,
    betting: tab === 'active',
    auctionSum: tab === 'outbid',
  };

  const containerClassName = Object.entries(tabClasses)
    .filter(([, condition]) => condition)
    .map(([className]) => className);

  return (
    <div className={cardWrapp}>
      <ItemCardInfoBlock item={item}>
        <>
          <LotStatusBlock lotStatus={lotStatus} />
          <ManageCardBlock id={item.id} />
        </>
      </ItemCardInfoBlock>
      <div className={priceWrapp}>
        <div className={userProfilePriceBlock}>
          <PriceBlock
            className={containerClassName}
            totalCost={item.quantity * item.pricePerTon}
            unitCost={item.pricePerTon}
            currency={item.currency}
          />
          <CustomButton
            size="M"
            text={`${tab === 'active' ? 'New bet' : 'My bet'}`}
            type="secondary"
            icon={<GavelIcon />}
            handleClick={handleClick}
          />
        </div>
        <div className={userProfilePriceBlock}>
          <PriceBlock
            className={['list']}
            totalCost={item.quantity * item.pricePerTon}
            unitCost={item.pricePerTon}
            currency={item.currency}
          />
          <CustomButton
            size="M"
            text="Buy now"
            icon={<ShoppingCartOutlinedIcon />}
            handleClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
};

export default BettingCard;
