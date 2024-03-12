import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

import CircularProgress from '@mui/material/CircularProgress';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

import PriceBlock from '@components/priceBlock';
import { CustomButton } from '@components/buttons/CustomButton';
import Timer from '@components/timer';
import CustomSlider from '@components/customSlider';
import CustomBreadcrumbs from '@components/customBreadcrumbs';
import { PlaceBetForm } from '@components/placeBetForm';
import { TagsBlock } from '@components/tagsBlock';

import getNumberWithCurrency from '@helpers/getNumberWithCurrency';
import getFormattedDate from '@helpers/getFormattedDate';
import { getButtonText } from '@helpers/getButtonText';
import {
  handleDeactivateBtnClick,
  handlePlaceNewBet,
  handleDealBtnClick,
  handleEditLotButtonClick,
  handleDeal,
  handleDeactivateLot,
} from '@helpers/lotHandlers';

import { categoriesSelector } from '@slices/categoriesSlice';
import { selectLotDetailById } from '@slices/lotListSlice';
import { selectModal } from '@slices/modalSlice';
import { betsSelector } from '@slices/betsSlice';

import { fetchLotDetails } from '@thunks/fetchLots';
import { fetchAllCategories } from '@thunks/fetchCategories';
import { getUserFromCognito } from '@thunks/fetchUsers';
import { fetchBetsByLotId } from '@thunks/fetchBets';

import attentionIcon from '@icons/attention.svg';
import mapIcon from '@icons/mapIcon.svg';

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
  noImage,
  noBetsBlock,
} = styles;

export const LotDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: lotId } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const { loadingStatus } = useSelector((state) => state.lotList);
  const selectedLot = useSelector((state) => selectLotDetailById(state, lotId));
  const userInfo = useSelector((state) => state.usersList.userInfo);

  const [userType, setUserType] = useState('unregisteredUser');
  const [isUserLotOwner, setIsUserLotOwner] = useState(false);

  const categories = useSelector(categoriesSelector);
  const confirmModalData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );
  const currentBets = useSelector(betsSelector);
  const [betFieldValue, setBetFieldValue] = useState();
  const betModalData = useSelector((state) =>
    selectModal(state, 'placeBetModal')
  );
  const newBet = useSelector((state) => state.bets.newBet);

  const handleDealClick = () => {
    handleDealBtnClick(dispatch, isAuctionLot, selectedLot, userInfo.id);
  };

  const handleEditClick = () => {
    handleEditLotButtonClick(navigate, lotId);
  };

  useEffect(() => {
    dispatch(getUserFromCognito());
    dispatch(fetchAllCategories());
    dispatch(fetchLotDetails(lotId));
    dispatch(fetchBetsByLotId({ id: lotId }));
  }, []);

  useEffect(() => {
    if (!userInfo || !selectedLot) {
      return;
    }

    !_.isEmpty(selectedLot) &&
      setIsUserLotOwner(userInfo.id === selectedLot.userId);
    setUserType(
      userInfo['custom:role'] === 'admin' ? 'admin' : 'registeredUser'
    );
  }, [userInfo, selectedLot]);

  useEffect(() => {
    const { confirmStatus, action, isOpen } = confirmModalData;

    if (!isOpen) {
      switch (action) {
        case 'placeBet':
          confirmStatus && newBet && handlePlaceNewBet(dispatch, newBet);
          break;

        case 'deal':
          confirmStatus &&
            handleDeal({
              dispatch: dispatch,
              lotId: lotId,
              userId: userInfo.id,
            });
          break;

        case 'deactivateLot':
          confirmStatus && handleDeactivateLot(lotId);
          break;
      }
    }
  }, [confirmModalData, betModalData]);

  useEffect(() => {
    if (!_.isEmpty(currentBets)) {
      const currLotBets = _.filter(currentBets, { lotId: _.toNumber(lotId) });
      const lastBet = _.maxBy(currLotBets, 'id');

      setBetFieldValue(lastBet?.amount);
    }
  }, [currentBets]);

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
    price,
    quantity,
    location,
    variety,
    size,
    packaging,
    images,
    bets,
    tags,
  } = selectedLot;

  const buySellBtnText = getButtonText(lotType);
  const isLastBetEqualPrice = betFieldValue === price;
  const isAuctionLot = lotType === 'auctionSell';
  const isTransaction = !_.isEmpty(bets);

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
    {
      key: 'Tags',
      value: !_.isEmpty(tags) ? <TagsBlock tags={tags} /> : 'No tags',
    },
  ];

  return (
    <div className={pageContainer}>
      <div className={breadCrumbs}>
        <CustomBreadcrumbs
          lot={selectedLot}
          categories={categories}
          setSearchParams={setSearchParams}
        />
      </div>
      <div className={container}>
        {
          <>
            <div className={leftSide}>
              <div className={imageContainer}>
                {images.length > 0 ? (
                  <CustomSlider images={images} />
                ) : (
                  <div className={noImage}>
                    <ImageNotSupportedIcon />
                  </div>
                )}
              </div>
            </div>
            <div className={rightSide}>
              <div className={heading}>
                <h4 className={title}>{title}</h4>
                <div className={dateCounter}>
                  {expirationDate && <Timer endDate={expirationDate} />}
                  <div className={id}>{`ID ${id}`}</div>
                </div>
              </div>
              <div className={descriptionContainer}>
                <img src={attentionIcon} alt="Attention icon" />
                <p className={description}>{description}</p>
              </div>
              <div className={betPriceContainer}>
                <div className={betContainer}>
                  <div className={priceTotalContainer}>
                    {isAuctionLot && (
                      <>
                        <p className={body2}>Bet</p>

                        <div>
                          {isTransaction ? (
                            <PriceBlock
                              totalCost={betFieldValue}
                              unitCost={betFieldValue / quantity}
                              currency={currency}
                              className={['detailed', 'auctionSum']}
                            />
                          ) : (
                            <h4 className={noBetsBlock}>No bets</h4>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {isAuctionLot &&
                    userType === 'registeredUser' &&
                    !isUserLotOwner &&
                    !isLastBetEqualPrice && <PlaceBetForm lot={selectedLot} />}
                  {isUserLotOwner && !isTransaction && (
                    <CustomButton
                      width="100%"
                      type="secondary"
                      text="Edit"
                      icon={<ModeEditOutlineOutlinedIcon />}
                      handleClick={handleEditClick}
                    />
                  )}
                </div>

                <div className={priceContainer}>
                  <div className={priceTotalContainer}>
                    <p className={body2}>Total price</p>
                    <div>
                      <PriceBlock
                        totalCost={price}
                        unitCost={price / quantity}
                        currency={currency}
                        className={['detailed']}
                      />
                    </div>
                  </div>
                  {userType === 'registeredUser' &&
                    !isUserLotOwner &&
                    !isLastBetEqualPrice && (
                      <CustomButton
                        type="primary"
                        width="100%"
                        icon={<ShoppingCartOutlinedIcon />}
                        text={buySellBtnText}
                        handleClick={handleDealClick}
                      />
                    )}
                  {isUserLotOwner && !isTransaction && (
                    <CustomButton
                      type="secondary"
                      text="Deactivate"
                      width="100%"
                      icon={<PowerSettingsNewOutlinedIcon />}
                      handleClick={handleDeactivateBtnClick}
                      color="error"
                    />
                  )}
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
