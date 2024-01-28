import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import ImageListItem from '@mui/material/ImageListItem';
import PriceBlock from '../../components/priceBlock';
import getNumberWithCurrency from '../../helpers/getNumberWithCurrency';
import getFormattedDate from '../../helpers/getFormattedDate ';
import { fetchLotDetails } from '../../store/slices/lotDetailsSlice';
import { lotDetailedSelector } from '../../store/slices/lotDetailsSlice';
import { CustomButton } from '../../components/buttons/CustomButton';
import Timer from '../../components/timer';
import attentionIcon from '../../assets/icons/attention.svg';
import cartIcon from '../../assets/icons/cartIcon.svg';
import mapIcon from '../../assets/icons/mapIcon.svg';
import sliderImage from '../../assets/images/77d4dc59-3013-41aa-8a7b-cb27cb6fa425.jpg';
import styles from './lotDetails.module.scss';

export const LotDetails = () => {
  const dispatch = useDispatch();
  const lotDetails = useSelector((state) => state.lotDetails);
  const { loadingStatus, lotID } = lotDetails;
  const lotData = useSelector((state) => lotDetailedSelector(state, lotID));

  useEffect(() => {
    dispatch(fetchLotDetails(lotID));
  }, [dispatch, lotID]);

  if (loadingStatus !== 'fulfilled') {
    return (
      <div className={styles.container}>
        <CircularProgress />
      </div>
    );
  }

  const {
    id,
    title,
    creationDate,
    expirationDate,
    description,
    lotType,
    currency,
    pricePerTon,
    quantity,
    location,
    variety = 'idared',
    size = '70+',
    packaging = 'bins',
  } = lotData;

  const totalPrice = quantity * pricePerTon;

  const totalPriceWithCurrency = getNumberWithCurrency(
    quantity * pricePerTon,
    currency
  );

  const buySellBtnText = `${
    lotType[0].toUpperCase() + lotType.slice(1)
  } for ${totalPriceWithCurrency}`;

  const getLocation = () => {
    return (
      <div className={styles.locationContainer}>
        <img src={mapIcon} alt='Map icon' />
        <h6>{`${location.country}, ${location.region}`}</h6>
      </div>
    );
  };

  const lotDescription = [
    { key: 'Variety', value: variety },
    { key: 'Quantity', value: `${quantity} ton` },
    { key: 'Size', value: size },
    { key: 'Packaging', value: packaging },
    { key: 'Location', value: getLocation() },
    { key: 'Created', value: getFormattedDate(creationDate) },
  ];

  return (
    <>
      <div className={styles.breadCrumbs} />
      <div className={styles.container}>
        {loadingStatus === 'fulfilled' && (
          <>
            <div className={styles.leftSide}>
              <div className={styles.imageContainer}>
                <ImageListItem key={sliderImage}>
                  <img
                    src={`${sliderImage}?w=164&h=164&fit=crop&auto=format`}
                    alt={'Slider image'}
                    loading='lazy'
                  />
                </ImageListItem>
              </div>
            </div>
            <div className={styles.rightSide}>
              <div className={styles.heading}>
                <h4 className={styles.title}>{title}</h4>
                <div className={styles.dateCounter}>
                  <Timer endDate={expirationDate} />
                  <div className={styles.id}>{id}</div>
                </div>
              </div>
              <div className={styles.descriptionContainer}>
                <img src={attentionIcon} alt='Attention icon' />
                <p className={styles.description}>{description}</p>
              </div>
              <div className={styles.betPriceContainer}>
                <div className={styles.betContainer} />

                <div className={styles.priceContainer}>
                  <div className={styles.priceTotalContainer}>
                    <p className={styles.body2}>Total price</p>
                    <div>
                      <PriceBlock
                        totalCost={totalPrice}
                        unitCost={pricePerTon}
                        currency={currency}
                        className={['detailed']}
                      />
                    </div>
                  </div>
                  <CustomButton
                    type='primary'
                    width={'100%'}
                    icon={<img src={cartIcon} alt='Cart icon' />}
                    text={buySellBtnText}
                  />
                </div>
              </div>
              <div className={styles.lotDetailsContainer}>
                {lotDescription.map((i, index) => (
                  <div
                    key={i.key}
                    className={`${styles.lotDetailsRow} ${
                      index < 4 && styles.lotDetailsRow_bordered
                    }`}
                  >
                    <h6 className={styles.lotDetailsKey}>{i.key}</h6>
                    <h6 className={styles.lotDetailsValue}>{i.value}</h6>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
