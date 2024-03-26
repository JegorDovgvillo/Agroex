import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

import getFormattedDate from '@helpers/getFormattedDate';
import getNumberWithCurrency from '@helpers/getNumberWithCurrency';
import { IMAGE_URL } from '@helpers/endpoints';
import { getCorrectedTimeZone } from '@helpers/getCorrectTime';

import { TagsBlock } from '@components/tagsBlock';

import Timer from '../timer';

import styles from './itemCard.module.scss';

const ItemCardInfoBlock = ({ item, userTimeZone, children }) => {
  const image = item.images[0] || null;
  const isLotFinished = item.status === 'finished';
  const correctedExpirationDate = getCorrectedTimeZone(
    item.expirationDate,
    userTimeZone
  );

  return (
    <>
      <div className={styles.imageContainer}>
        {image && image.name ? (
          <img
            src={`${IMAGE_URL}/${image.name}`}
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
          {!isLotFinished && item.expirationDate && (
            <Timer
              endDate={correctedExpirationDate}
              userTimeZone={userTimeZone}
            />
          )}
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
            {getFormattedDate({
              date: item.creationDate,
              timeZone: userTimeZone,
            })}
          </span>
          <TagsBlock tags={item.tags} />
        </div>
      </div>
    </>
  );
};

export default ItemCardInfoBlock;
