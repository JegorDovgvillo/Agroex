import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

import CircularProgress from '@mui/material/CircularProgress';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';

import PriceBlock from '@components/priceBlock';
import { CustomButton } from '@components/buttons/CustomButton';
import Timer from '@components/timer';
import CustomSlider from '@components/customSlider';
import CustomBreadcrumbs from '@components/customBreadcrumbs';
import { PlaceBetForm } from '@components/placeBetForm';
import { TagsBlock } from '@components/tagsBlock';
import LotStatusBlock from '@components/lotStatusBlock';
import { getLotStatuses } from '@components/lotStatusBlock/getLotStatuses';

import getNumberWithCurrency from '@helpers/getNumberWithCurrency';
import getFormattedDate from '@helpers/getFormattedDate';
import { getButtonText } from '@helpers/getButtonText';
import {
  handleToggleUserLotStatusBtnClick,
  handlePlaceNewBet,
  handleDealBtnClick,
  handleEditLotButtonClick,
  handleDeal,
  handleDeactivateLot,
  handleChangeLotStatusByUser,
} from '@helpers/lotHandlers';
import { getLotState } from '@helpers/lotHandlers/getLotState';

import { categoriesSelector } from '@slices/categoriesSlice';
import { selectLotDetailById } from '@slices/lotListSlice';
import { selectModal } from '@slices/modalSlice';
import { betsSelector } from '@slices/betsSlice';
import { selectUserById } from '@slices/usersListSlice';

import { fetchLotDetails } from '@thunks/fetchLots';
import { fetchAllCategories } from '@thunks/fetchCategories';
import { getUserFromCognito, fetchUser } from '@thunks/fetchUsers';
import { fetchBetsByLotId } from '@thunks/fetchBets';

import { ManageLotStatusBlock } from './manageLotStatusBlock';
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
  manageLotStatusBlock,
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
  const [lastBet, setLastBet] = useState();
  const betModalData = useSelector((state) =>
    selectModal(state, 'placeBetModal')
  );
  const lotWinnerData = useSelector((state) =>
    selectUserById(state, lastBet?.userId)
  );
  const newBet = useSelector((state) => state.bets.newBet);

  const handleDealClick = () => {
    handleDealBtnClick(dispatch, isAuctionLot, selectedLot, userInfo.id);
  };

  const handleEditClick = () => {
    handleEditLotButtonClick(navigate, lotId);
  };

  const handleChangeStatusClick = () => {
    handleToggleUserLotStatusBtnClick(dispatch);
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
    setLastBet(_.maxBy(selectedLot.bets, 'id'));
    setUserType(
      userInfo['custom:role'] === 'admin' ? 'admin' : 'registeredUser'
    );
  }, [userInfo, selectedLot]);

  useEffect(() => {
    const { confirmStatus, action, isOpen } = confirmModalData;

    if (!isOpen && confirmStatus) {
      switch (typeof action === 'string' ? action : action.name) {
        case 'toggleUserLotStatus':
          handleChangeLotStatusByUser({
            dispatch,
            lotId: selectedLot.id,
            userStatus: selectedLot.userStatus,
          });
          break;

        case 'placeBet':
          newBet && handlePlaceNewBet(dispatch, newBet);
          break;

        case 'deal':
          handleDeal({
            dispatch: dispatch,
            lotId: lotId,
            userId: userInfo.id,
          });
          break;

        case 'deactivateLot':
          handleDeactivateLot(dispatch, lotId);
          break;
      }
    }
  }, [confirmModalData, betModalData]);

  useEffect(() => {
    if (!_.isEmpty(currentBets)) {
      const currLotBets = _.filter(currentBets, { lotId: _.toNumber(lotId) });
      const lastBet = _.maxBy(currLotBets, 'id');

      dispatch(fetchUser(lastBet?.userId));
      setLastBet(lastBet);
    }
    dispatch(fetchLotDetails(lotId));
  }, [currentBets]);

  if (loadingStatus !== 'fulfilled') {
    return (
      <div className={container}>
        <CircularProgress />
      </div>
    );
  } else if (loadingStatus === 'rejected' && !selectedLot) {
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
    tags,
  } = selectedLot;

  const buySellBtnText = getButtonText(lotType);
  const isLastBetEqualPrice = lastBet?.amount === price;

  const {
    isAuctionLot,
    isLotTransaction,
    isLotFinished,
    isLotExpired,
    isRejectedByAdminLot,
    isDeactivatedByUser,
  } = getLotState(selectedLot);

  const isUserWinner = isLotFinished && userInfo.id === lastBet?.userId;
  const lotStatuses = selectedLot
    ? getLotStatuses({
        tab: 'detailsPage',
        item: selectedLot,
        isLotExpired,
        isLotFinished,
        isUserWinner,
        isAuctionLot,
        isUserLotOwner,
        isDeactivatedByUser,
        isAdmin: userType === 'admin',
      })
    : [];

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
    {
      key: 'Created',
      value: getFormattedDate({
        date: creationDate,
        timeZone: userInfo.zoneinfo,
      }),
    },
    {
      key: 'Tags',
      value: !_.isEmpty(tags) ? <TagsBlock tags={tags} /> : 'No tags',
    },
  ];

  if (isUserLotOwner || userType === 'admin') {
    if (isLotFinished && lotWinnerData) {
      const winnerData = (
        <div>
          name: {lotWinnerData.username},
          <br />
          email: {lotWinnerData.email}
        </div>
      );

      lotDescription.unshift({
        key: 'Winner',
        value: winnerData,
      });
    }
  }

  if (lastBet) {
    lotDescription.unshift({
      key: 'Last bet',
      value: getFormattedDate({
        date: lastBet.betTime,
        timeZone: userInfo.zoneinfo,
      }),
    });
  }

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
              {userType === 'admin' && !isLotFinished && (
                <div className={manageLotStatusBlock}>
                  <ManageLotStatusBlock {...selectedLot} />
                </div>
              )}
              <div className={heading}>
                <h4 className={title}>{title}</h4>
                <div className={dateCounter}>
                  {expirationDate && !isLotFinished && (
                    <Timer
                      endDate={expirationDate}
                      userTimeZone={userInfo.zoneinfo}
                    />
                  )}
                  <div className={id}>{`ID ${id}`}</div>
                  {!_.isEmpty(lotStatuses) && (
                    <LotStatusBlock lotStatuses={lotStatuses} />
                  )}
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
                          {lastBet ? (
                            <PriceBlock
                              totalCost={lastBet.amount}
                              unitCost={lastBet.amount / quantity}
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
                  {isUserLotOwner &&
                    !isLotExpired &&
                    (isRejectedByAdminLot || !isLotTransaction) && (
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
                  {isUserLotOwner && !isLotTransaction && !isLotExpired && (
                    <CustomButton
                      type="secondary"
                      text={isDeactivatedByUser ? 'Activate' : 'Deactivate'}
                      width="100%"
                      icon={
                        isDeactivatedByUser ? (
                          <PlayArrowOutlinedIcon />
                        ) : (
                          <PowerSettingsNewOutlinedIcon />
                        )
                      }
                      handleClick={handleChangeStatusClick}
                      color={isDeactivatedByUser ? 'success' : 'error'}
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
