import { useNavigate, generatePath } from 'react-router-dom';
import _ from 'lodash';

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
    const path = generatePath(ROUTES.LOTS_DETAILS, {
      id: item.id,
    });
    navigate(path);
  };

  const handleUpdateLot = (event) => {
    event.stopPropagation();
    const path = generatePath(ROUTES.UPDATE_LOT, {
      id: item.id,
    });
    navigate(path);
  };

  const handleClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className={styles.cardWrapp} onClick={viewDetailsCard}>
      <ItemCardInfoBlock item={item} />
      <div className={styles.buttonWrap}>
        <CustomButton size="S" text="Update" handleClick={handleUpdateLot} />
      </div>
      <div className={styles.priceWrapp}>
        <div className={styles.priceBlock}>
          {!_.isEmpty(item.bets) ? (
            <PriceBlock
              className={['list', 'auctionSum']}
              totalCost={item.bets.number}
              unitCost={item.bets.number / item.quantity}
              currency={item.currency}
            />
          ) : (
            <h6 className={styles.auctionSum}>No bets</h6>
          )}

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
            totalCost={item.price}
            unitCost={item.price / item.quantity}
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
