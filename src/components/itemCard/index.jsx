import { useNavigate } from 'react-router-dom';

import ROUTES from '@helpers/routeNames';
import { CustomButton } from '@buttons/CustomButton';
import PriceBlock from '@components/priceBlock';

import shoppingIcon from '@icons/shopping.svg';
import betIcon from '@icons/bet.svg';
import ItemCardInfoBlock from './itemCardInfo';

import styles from './itemCard.module.scss';

const ItemCard = ({ ...item }) => {
  const navigate = useNavigate();

  const viewDetailsCard = () => {
    navigate(ROUTES.LOTS_DETAILS.replace(':id', item.id));
  };

  const handleUpdateLot = (event) => {
    event.stopPropagation();
    navigate(ROUTES.UPDATE_LOT.replace(':id', item.id));
  };

  const handleClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className={styles.cardWrapp} onClick={viewDetailsCard}>
      <ItemCardInfoBlock item={item} />
      <div className={styles.priceWrapp}>
        <div className={styles.priceBlock}>
          <PriceBlock
            className={['list', 'auctionSum']}
            totalCost={item.quantity * item.pricePerTon}
            unitCost={item.pricePerTon}
            currency={item.currency}
          />
          <CustomButton
            size="M"
            text="My bet"
            type="secondary"
            icon={<img src={betIcon} />}
            handleClick={handleClick}
          />
        </div>
        <div className={styles.priceBlock}>
          <PriceBlock
            className={['list']}
            totalCost={item.quantity * item.pricePerTon}
            unitCost={item.pricePerTon}
            currency={item.currency}
          />
          <CustomButton
            size="M"
            text={`${item.lotType} now`}
            icon={<img src={shoppingIcon} />}
            handleClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
