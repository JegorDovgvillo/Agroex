import { DateTime } from 'luxon';
import { useDispatch } from 'react-redux';
import { updateId } from '../../store/slices/lotDetailsSlice';
import { CustomButton } from '../buttons/CustomButton';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../helpers/routeNames';
import img from '../../assets/icons/image15.png';
import PriceBlock from '../priceBlock';
import styles from './itemCard.module.scss';
import Timer from '../timer';
import shoppingIcon from '../../assets/icons/shopping.svg';
import betIcon from '../../assets/icons/bet.svg';

const ItemCard = (item) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const viewDetailsCard = () => {
    dispatch(updateId(item.id));
    navigate(ROUTES.LOTS_DETAILS);
  };
  
  const handleButtonClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className={styles.cardWrapp} onClick={viewDetailsCard}>
      <img src={img} className={styles.image} alt="item image"></img>
      <div className={styles.infoWrap}>
        <h6 className={styles.title}>{item.title}</h6>
        <div className={styles.technicalInfo}>
          <Timer endDate={item.expirationDate} />
          <span className={styles.itemId}>ID{item.id}</span>
        </div>
        <div className={styles.info}>
          <span>
            {item.productCategory.title}, idared, {item.quantity}ton, 70+, bins
          </span>
          <span>
            {item.location.country}, {item.location.region}
          </span>
          <span className={styles.creationDate}>
            {DateTime.fromISO(item.creationDate).toFormat('dd.MM.yyyy, HH:mm')}
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
            handleButtonClick={handleButtonClick}
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
            text="Buy now"
            icon={<img src={shoppingIcon} />}
            handleButtonClick={handleButtonClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
