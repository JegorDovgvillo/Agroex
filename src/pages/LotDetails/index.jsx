import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import ImageListItem from '@mui/material/ImageListItem';

import PriceBlock from '@components/priceBlock';
import { CustomButton } from '@components/buttons/CustomButton';
import Timer from '@components/timer';

import getNumberWithCurrency from '@helpers/getNumberWithCurrency';
import getFormattedDate from '@helpers/getFormattedDate';

import { selectLotDetailById, setLotId } from '@store/slices/lotListSlice';
import { fetchLotDetails } from '@store/thunks/fetchLots';

import attentionIcon from '@assets/icons/attention.svg';
import cartIcon from '@assets/icons/cartIcon.svg';
import mapIcon from '@assets/icons/mapIcon.svg';
import sliderImage from '@assets/images/77d4dc59-3013-41aa-8a7b-cb27cb6fa425.jpg';

import styles from './lotDetails.module.scss';

const {
  body2,
  breadCrumbs,
  pageContainer,
  container,
  leftSide,
  rightSide,
  imageContainer,
  heading,
  dateCounter,
  descriptionContainer,
  betPriceContainer,
  betContainer,
  priceContainer,
  priceTotalContainer,
  locationContainer,
  lotDetailsContainer,
  lotDetailsRow,
  lotDetailsValue,
  lotDetailsKey,
  lotDetailsRow_bordered,
} = styles;

export const LotDetails = () => {
  const dispatch = useDispatch();
  const { id: lotId } = useParams();

  const { loadingStatus } = useSelector((state) => state.lotList);
  const selectedLot = useSelector((state) => selectLotDetailById(state, lotId));

  useEffect(() => {
    dispatch(setLotId(lotId));
    dispatch(fetchLotDetails(lotId));
  }, [dispatch, lotId]);

  if (loadingStatus !== 'fulfilled') {
    return (
      <div className={container}>
        <CircularProgress />
      </div>
    );
  } else if (loadingStatus === 'fulfilled' && !selectedLot) {
    return;
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
    variety,
    size,
    packaging,
  } = selectedLot;

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
      <div className={locationContainer}>
        <img src={mapIcon} alt="Map icon" />
        <h6>{`${location.countryName}, ${location.region}`}</h6>
      </div>
    );
  };

  const lotDescription = [
    { key: 'Variety', value: variety },
    { key: 'Quantity', value: `${getNumberWithCurrency(quantity, '')} ton` },
    { key: 'Size', value: size },
    { key: 'Packaging', value: packaging },
    { key: 'Location', value: getLocation() },
    { key: 'Created', value: getFormattedDate(creationDate) },
  ];

  return (
    <div className={pageContainer}>
      <div className={breadCrumbs} />
      <div className={container}>
        {
          <>
            <div className={leftSide}>
              <div className={imageContainer}>
                <ImageListItem key={sliderImage}>
                  <img
                    src={`${sliderImage}?w=164&h=164&fit=crop&auto=format`}
                    alt="Slider image"
                    loading="lazy"
                  />
                </ImageListItem>
              </div>
            </div>
            <div className={rightSide}>
              <div className={heading}>
                <h4 className={title}>{title}</h4>
                <div className={dateCounter}>
                  <Timer endDate={expirationDate} />
                  <div className={id}>{`ID ${id}`}</div>
                </div>
              </div>
              <div className={descriptionContainer}>
                <img src={attentionIcon} alt="Attention icon" />
                <p className={description}>{description}</p>
              </div>
              <div className={betPriceContainer}>
                <div className={betContainer} />
                <div className={priceContainer}>
                  <div className={priceTotalContainer}>
                    <p className={body2}>Total price</p>
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
                    type="primary"
                    width="100%"
                    icon={<img src={cartIcon} alt="Cart icon" />}
                    text={buySellBtnText}
                  />
                </div>
              </div>
              <div className={lotDetailsContainer}>
                {lotDescription.map((i, index) => (
                  <div
                    key={i.key}
                    className={`${lotDetailsRow} ${
                      index < 4 && lotDetailsRow_bordered
                    }`}
                  >
                    <h6 className={lotDetailsKey}>{i.key}</h6>
                    <h6 className={lotDetailsValue}>{i.value}</h6>
                  </div>
                ))}
              </div>
            </div>
          </>
        }
      </div>
    </div>
  );
};
