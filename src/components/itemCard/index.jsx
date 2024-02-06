import { useNavigate } from 'react-router-dom';

import { CustomButton } from '../buttons/CustomButton';
import PriceBlock from '../priceBlock';
import Timer from '../timer';

import ROUTES from '@helpers/routeNames';
import getFormattedDate from '@helpers/getFormattedDate';
import getNumberWithCurrency from '@helpers/getNumberWithCurrency';

import shoppingIcon from '@assets/icons/shopping.svg';
import betIcon from '@assets/icons/bet.svg';
import img from '@assets/images/77d4dc59-3013-41aa-8a7b-cb27cb6fa425.jpg';

import styles from './itemCard.module.scss';

const ItemCard = (item) => {
  const navigate = useNavigate();

  const viewDetailsCard = () => {
    navigate(ROUTES.LOTS_DETAILS.replace(':id', item.id));
  };

  const handleClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className={styles.cardWrapp} onClick={viewDetailsCard}>
      <div className={styles.imageContainer}>
        <img src={img} className={styles.image} alt="item image" />
      </div>

      <div className={styles.infoWrap}>
        <h6 className={styles.title}>{item.title}</h6>
        <div className={styles.technicalInfo}>
          <Timer endDate={item.expirationDate} />
          <span className={styles.itemId}>ID{item.id}</span>
        </div>
        <div className={styles.info}>
          <span>
            {/* {item.productCategory.title} */}
            Apples, {item.variety}, {getNumberWithCurrency(item.quantity)} ton,{' '}
            {item.size}, {item.packaging}
          </span>
          <span>
            {item.location.countryName}, {item.location.region}
          </span>
          <span className={styles.creationDate}>
            {getFormattedDate(item.creationDate)}
          </span>
        </div>
      </div>
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
