import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, generatePath } from 'react-router-dom';

import { DateTime } from 'luxon';
import _ from 'lodash';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

import { CustomButton } from '@buttons/CustomButton';
import PriceBlock from '@components/priceBlock';

import { toggleModal } from '@slices/modalSlice';

import ROUTES from '@helpers/routeNames';
import { getButtonText } from '@helpers/getButtonText';
import {
  handleDealBtnClick,
  handleDeactivateBtnClick,
  handleEditLotButtonClick,
} from '@helpers/lotHandlers';

import ItemCardInfoBlock from './itemCardInfo';
import ManageCardBlock from './manageCardBlock';
import LotStatusBlock from './lotStatusBlock';

import styles from './itemCard.module.scss';

const {
  priceBlock,
  adminComment,
  pricesContainer,
  priceWrapp,
  auctionSum,
  editBtnContainer,
} = styles;

const getLotStatuses = ({
  tab,
  item,
  isLotExpired,
  isLotFinished,
  isUserWinner,
  isAuctionLot,
  isUserLotOwner,
}) => {
  const lotStatuses = [];

  switch (tab) {
    case 'active':
      lotStatuses.push(item.lotType);
      isLotFinished && !isLotExpired && lotStatuses.push(item.status);
      break;

    case 'pending':
      lotStatuses.push(item.lotType, item.innerStatus);
      break;

    case 'inactive':
      lotStatuses.push(item.lotType, item.innerStatus, item.userStatus);
      break;

    case 'finished':
      lotStatuses.push(item.lotType);
      isLotExpired && lotStatuses.push('expired');
      isLotFinished && !isLotExpired && lotStatuses.push(item.status);
      isAuctionLot &&
        !isUserLotOwner &&
        lotStatuses.push(isUserWinner ? 'won' : 'lose');
      break;

    default:
      lotStatuses.push(item.lotType);
  }

  return lotStatuses;
};

const ItemCard = ({ item, setSelectedLot }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.usersList.userInfo);
  const [userType, setUserType] = useState('unregisteredUser');
  const [isUserLotOwner, setIsUserLotOwner] = useState(false);
  const isAdmin = userType === 'admin';
  const { tab } = useParams();

  const isAuctionLot = item.lotType === 'auctionSell';
  const isNewLot = item.innerStatus === 'new';
  const isLotTransaction = !_.isEmpty(item.bets);
  const isLotFinished = item.status === 'finished';
  const isLotExpired = !isLotTransaction && isLotFinished;
  const isRejectedByAdminLot = item.innerStatus === 'rejected';
  const isDeactivatedByUserLot = item.userStatus === 'inactive';

  const priceBtnText = getButtonText(item.lotType);
  const lastBet = isLotTransaction && _.maxBy(item.bets, 'id');
  const isUserWinner = user.id === lastBet.userId;

  const lotStatuses = getLotStatuses({
    tab,
    item,
    isLotExpired,
    isLotFinished,
    isUserWinner,
    isAuctionLot,
    isUserLotOwner,
  });

  const getLotActions = () => {
    let actionsArr = [];

    if (
      (tab === 'active' && !isLotTransaction) ||
      (tab === 'pending' && isNewLot) ||
      (!tab && isUserLotOwner && !isAuctionLot)
    ) {
      actionsArr = _.concat(actionsArr, ['edit', 'deactivate']);
    }

    if (tab === 'inactive') {
      actionsArr = _.concat(
        actionsArr,
        !isLotExpired && isDeactivatedByUserLot && ['activate'],
        !isLotExpired && isRejectedByAdminLot && ['edit'],
        !isLotTransaction && ['delete']
      );
    }

    return _.uniq(actionsArr);
  };

  const actions = isUserLotOwner && getLotActions();

  const viewDetailsCard = () => {
    const path = generatePath(ROUTES.LOTS_DETAILS, {
      id: item.id,
    });

    navigate(path);
  };

  const handleBet = (event) => {
    event.stopPropagation();
    setSelectedLot(item);
    dispatch(toggleModal('placeBetModal'));
  };

  const handleDeal = (event) => {
    event.stopPropagation();
    setSelectedLot(item);
    handleDealBtnClick(dispatch, isAuctionLot, item, user.id);
  };

  const handleDeactivateLot = (event) => {
    event.stopPropagation();
    setSelectedLot(item);
    handleDeactivateBtnClick(dispatch, isAdmin);
  };

  const handleEditLot = (event) => {
    event.stopPropagation();
    handleEditLotButtonClick(navigate, item.id);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    setIsUserLotOwner(user.id === item.userId);
    setUserType(user['custom:role'] === 'admin' ? 'admin' : 'registeredUser');
  }, [user]);

  return (
    <>
      <div className={styles.cardWrapp} onClick={viewDetailsCard}>
        <ItemCardInfoBlock item={item}>
          <>
            {!_.isEmpty(lotStatuses) && (
              <LotStatusBlock lotStatuses={lotStatuses} />
            )}
            {tab && !_.isEmpty(actions) && (
              <ManageCardBlock id={item.id} actions={actions} />
            )}
          </>
        </ItemCardInfoBlock>
        <div className={pricesContainer}>
          <div className={priceWrapp}>
            <div className={priceBlock}>
              {isAuctionLot ? (
                <>
                  {!_.isEmpty(item.bets) ? (
                    <PriceBlock
                      className={['list', 'auctionSum']}
                      totalCost={lastBet.amount}
                      unitCost={lastBet.amount / item.quantity}
                      currency={item.currency}
                    />
                  ) : (
                    <h6 className={auctionSum}>No bets</h6>
                  )}
                  {userType === 'registeredUser' &&
                    !isUserLotOwner &&
                    !isLotFinished && (
                      <CustomButton
                        size="S"
                        text={'My bet'}
                        icon={<GavelOutlinedIcon />}
                        handleClick={handleBet}
                        type="secondary"
                      />
                    )}
                </>
              ) : (
                <div className={editBtnContainer}>
                  {!tab && isUserLotOwner && (
                    <CustomButton
                      size="S"
                      type="secondary"
                      text="Edit"
                      icon={<ModeEditOutlineOutlinedIcon />}
                      handleClick={handleEditLot}
                    />
                  )}
                </div>
              )}
            </div>

            <div className={priceBlock}>
              <PriceBlock
                className={['list']}
                totalCost={item.price}
                unitCost={item.price / item.quantity}
                currency={item.currency}
              />

              {userType === 'registeredUser' &&
                !isUserLotOwner &&
                !isLotFinished && (
                  <CustomButton
                    size="S"
                    text={priceBtnText}
                    icon={<ShoppingCartOutlinedIcon />}
                    handleClick={handleDeal}
                  />
                )}

              {!tab && isUserLotOwner && !isAuctionLot && (
                <CustomButton
                  size="S"
                  type="secondary"
                  text="Deactivate"
                  icon={<PowerSettingsNewOutlinedIcon />}
                  handleClick={handleDeactivateLot}
                  color="error"
                />
              )}
            </div>
          </div>
          {userType === 'admin' && (
            <CustomButton
              size="S"
              type="secondary"
              text="Deactivate"
              icon={<PowerSettingsNewOutlinedIcon />}
              handleClick={handleDeactivateLot}
              color="error"
            />
          )}
          {tab && item.adminComment && (
            <div className={adminComment}>
              <ErrorOutlineIcon />
              {item.adminComment}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ItemCard;
