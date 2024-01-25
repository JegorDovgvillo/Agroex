import img from '../../images/image15.png';
import styles from './itemCard.module.scss';

const ItemCard = () => {
  return (
    <div className={styles.cardWrapp}>
      <img src={img} className={styles.image} alt="item image"></img>
      <div className={styles.infoWrap}>
        <h6 className={styles.title}>Apple idared</h6>
        <div className={styles.technicalInfo}>
          <span className={styles.expirationDate}>2d 23h </span>
          <span className={styles.itemId}>ID423-0932</span>
        </div>
        <div className={styles.info}>
          <span>Apple, idared, 10ton, 70+, bins </span>
          <span>Uzbekistan, Bukhara region</span>
          <span className={styles.creationDate}>25.06.2022, 12:55</span>
        </div>
      </div>
      <div className={styles.costsWrapp}>
        <div className={styles.bet}>
          <h6 className={styles.auctionSum}>$11,000.00</h6>
          <span>$1.1/kg</span>
        </div>
        <div className="sum">
          <h6>$11,000.00</h6>
          <span>$1.1/kg</span>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
