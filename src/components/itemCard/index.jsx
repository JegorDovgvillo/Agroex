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

const { priceBlock, adminComment, pricesContainer, priceWrapp, auctionSum } =
  styles;

const getLotStatuses = (tab, item, isLotTransaction) => {
  const lotStatuses = [];

  switch (tab) {
    case 'active':
      lotStatuses.push(item.lotType);
      break;

    case 'pending':
      lotStatuses.push(item.lotType, item.innerStatus);
      break;

    case 'inactive':
      lotStatuses.push(item.lotType, item.innerStatus, item.userStatus);
      isLotTransaction && lotStatuses.push('closed');
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
  const current = DateTime.local().toISO();
  const expiration = item?.expirationDate;

  const isLotExpired =
    DateTime.fromISO(current).diff(DateTime.fromISO(expiration)).milliseconds >
    0;

  const isAuctionLot = item.lotType === 'auctionSell';
  const isNewLot = item.innerStatus === 'new';
  const isFinishedLot = item.status === 'finished';
  const isLotTransaction = item.bets?.length > 0;
  const isRejectedByAdminLot = item.innerStatus === 'rejected';
  const isDeactivatedByUserLot = item.userStatus === 'inactive';
  const lotStatuses = getLotStatuses(tab, item, isLotTransaction, isLotExpired);
  const priceBtnText = getButtonText(item.lotType);
  const lastBet = !_.isEmpty(item.bets) && _.maxBy(item.bets, 'id');

  const getLotActions = () => {
    let actionsArr = [];

    if (
      (tab === 'active' && !isAuctionLot) ||
      (tab === 'pending' && isNewLot) ||
      (!tab && isUserLotOwner && !isAuctionLot)
    ) {
      actionsArr = _.concat(actionsArr, ['edit', 'deactivate']);
    }

    if (tab === 'inactive') {
      actionsArr = _.concat(
        actionsArr,
        !isLotExpired && isDeactivatedByUserLot ? ['activate'] : [],
        !isLotExpired && isRejectedByAdminLot ? ['edit'] : [],
        !isLotTransaction ? ['delete'] : []
      );
    }

    return _.uniq(actionsArr);
  };

  const actions = getLotActions();

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
                  {userType === 'registeredUser' && !isUserLotOwner && (
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
                <>
                  <div />
                  {!tab && isUserLotOwner && (
                    <CustomButton
                      size="S"
                      type="secondary"
                      text="Edit"
                      icon={<ModeEditOutlineOutlinedIcon />}
                      handleClick={handleEditLot}
                    />
                  )}
                </>
              )}
            </div>

            <div className={priceBlock}>
              <PriceBlock
                className={['list']}
                totalCost={item.price}
                unitCost={item.price / item.quantity}
                currency={item.currency}
              />

              {userType === 'registeredUser' && !isUserLotOwner && (
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
