import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

import getFormattedDate from '@helpers/getFormattedDate';
import getNumberWithCurrency from '@helpers/getNumberWithCurrency';
import ENDPOINTS, { IMAGE_URL } from '@helpers/endpoints';

import Timer from '../timer';

import styles from './itemCard.module.scss';

const ItemCardInfoBlock = ({ item, children }) => {
  const image = item.images[0] || null;

  return (
    <>
      <div className={styles.imageContainer}>
        {image && image.name ? (
          <img
            src={`${IMAGE_URL}${ENDPOINTS.IMAGES}/${image.name}`}
            className={styles.image}
            alt="item image"
          />
        ) : (
          <div className={styles.noImage}>
            <ImageNotSupportedIcon />
          </div>
        )}
      </div>

      <div className={styles.infoWrap}>
        <div className={styles.titleBlock}>
          <h6 className={styles.title}>{item.title}</h6>
          {children}
        </div>

        <div className={styles.technicalInfo}>
          <Timer endDate={item.expirationDate} />
          <span className={styles.itemId}>ID{item.id}</span>
        </div>
        <div className={styles.info}>
          <span>
            {item.productCategory.title}, {item.variety},{' '}
            {getNumberWithCurrency(item.quantity)} ton, {item.size},{' '}
            {item.packaging}
          </span>
          <span>
            {item.location.countryName}, {item.location.region}
          </span>
          <span className={styles.creationDate}>
            {getFormattedDate(item.creationDate)}
          </span>
        </div>
      </div>
    </>
  );
};

export default ItemCardInfoBlock;
