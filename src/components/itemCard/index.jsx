import { useDispatch } from 'react-redux';
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

import { toggleModal, setModalField } from '@slices/modalSlice';

import ROUTES from '@helpers/routeNames';
//import getNumberWithCurrency from '@helpers/getNumberWithCurrency';

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

const getButtonText = (lotType) => {
  let text = '';

  switch (lotType) {
    case 'sell':
    case 'auctionSell':
      text = 'buy';
      break;
    case 'buy':
      text = 'sell';
      break;
  }
  return `${text} now`;
};

const ItemCard = ({ item, setSelectedLot }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAdmin = true;
  const isUserLotOwner = false;
  //const isUserLotOwner = item.userId === '5ec0fa10-5e33-4d50-9107-d1a057f8eb5e'; //todo write logic to check if user is lot's owner
  const { tab } = useParams();
  const current = DateTime.local().toISO();
  const expiration = item?.expirationDate;

  const isLotExpired =
    DateTime.fromISO(current).diff(DateTime.fromISO(expiration)).milliseconds >
    0;
  const isAuctionLot = item.lotType === 'auctionSell';
  const isNewLot = item.innerStatus === 'new';
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
      actionsArr = _.union(actionsArr, ['edit', 'deactivate']);
    }

    if (tab === 'inactive') {
      actionsArr =
        !isLotExpired &&
        isDeactivatedByUserLot &&
        _.union(actionsArr, ['activate']);
      actionsArr =
        !isLotExpired && isRejectedByAdminLot && _.union(actionsArr, ['edit']);
      actionsArr = !isLotTransaction && _.union(actionsArr, ['delete']);
    }

    return actionsArr;
  };

  const actions = getLotActions();

  const viewDetailsCard = () => {
    const path = generatePath(ROUTES.LOTS_DETAILS, {
      id: item.id,
    });

    navigate(path);
  };

  //todo write confirm lot by user logic
  const handleBet = (event) => {
    event.stopPropagation();
    setSelectedLot(item);
    dispatch(toggleModal('placeBetModal'));
  };

  const handleDeal = (event) => {
    event.stopPropagation();
  };

  const handleDeactivateLot = (event) => {
    event.stopPropagation();
    setSelectedLot(item);

    dispatch(
      setModalField({
        modalId: 'confirmModal',
        field: 'text',
        value: 'This action changes the lot status. Do you confirm the action?',
      })
    );

    dispatch(
      setModalField({
        modalId: 'confirmModal',
        field: 'action',
        value: isAdmin ? 'deactivateLotByAdmin' : 'deactivateLot',
      })
    );

    dispatch(toggleModal('confirmModal'));
  };

  const handleEditLotButtonClick = (event) => {
    event.stopPropagation();
    navigate(ROUTES.UPDATE_LOT.replace(':id', item.id));
  };

  return (
    <div className={styles.cardWrapp} onClick={viewDetailsCard}>
      <ItemCardInfoBlock item={item}>
        <>
          {!_.isEmpty(lotStatuses) && (
            <LotStatusBlock lotStatuses={lotStatuses} />
          )}
          {!_.isEmpty(actions) && (
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
                {!isUserLotOwner && !isAdmin && (
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
                {isUserLotOwner && (
                  <CustomButton
                    size="S"
                    type="secondary"
                    text="Edit"
                    icon={<ModeEditOutlineOutlinedIcon />}
                    handleClick={handleEditLotButtonClick}
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

            {!isUserLotOwner && !isAdmin && (
              <CustomButton
                size="S"
                text={priceBtnText}
                icon={<ShoppingCartOutlinedIcon />}
                handleClick={handleDeal}
              />
            )}

            {isUserLotOwner && !isAuctionLot && (
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
        {isAdmin && (
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
  );
};

export default ItemCard;
