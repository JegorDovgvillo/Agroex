import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import _ from 'lodash';

import Filters from '@components/filters';
import ItemCard from '@components/itemCard';
import CustomBreadcrumbs from '@components/customBreadcrumbs';
import PlaceBetModal from '@customModals/placeBetModal';
import ConfirmActionModal from '@customModals/confirmActionModal';

import { fetchAllCategories } from '@thunks/fetchCategories';
import { fetchCountries } from '@thunks/fetchCountries';
import {
  filteredLots,
  fetchLotDetails,
  changeLotStatusByUser,
  changeLotStatusByAdmin,
  deleteLot,
} from '@thunks/fetchLots';
import { fetchUsers } from '@thunks/fetchUsers';
import { fetchPlaceBet } from '@thunks/fetchBets';

import { usersListSelector } from '@slices/usersListSlice';
import { categoriesSelector } from '@slices/categoriesSlice';
import { countrySelector } from '@slices/countriesSlice';
import { lotListSelector, clearLots } from '@slices/lotListSlice';
import { betsSelector } from '@slices/betsSlice';
import {
  setModalField,
  clearModalFields,
  selectModal,
  toggleModal,
} from '@slices/modalSlice';

import styles from './lotList.module.scss';

const LotList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const lots = useSelector(lotListSelector);
  const categories = useSelector(categoriesSelector);
  const bets = useSelector(betsSelector);

  const countries = useSelector(countrySelector);
  const users = useSelector(usersListSelector);

  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState([]);
  const [selectedSubcategoriesIds, setSelectedSubcategoriesIds] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [newBet, setNewBet] = useState();

  const confirmModalData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );
  const adminMessageData = useSelector((state) =>
    selectModal(state, 'adminMessageModal')
  );

  const handlePlaceNewBet = () => {
    dispatch(fetchPlaceBet({ id: newBet.lotId, betData: newBet }));
    dispatch(clearConfirmModalAction());
  };

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchCountries());
    dispatch(fetchUsers());

    return () => {
      dispatch(clearLots());
    };
  }, []);

  useEffect(() => {
    dispatch(filteredLots(searchParams));
  }, [searchParams]);

  useEffect(() => {
    const searchParamsCategoryIds = searchParams.get('categories');

    if (categories.length > 0 && searchParamsCategoryIds) {
      const selectedCategories = _.split(searchParamsCategoryIds, ',').map(
        (id) => _.find(categories, { id: _.toNumber(id) })
      );
      const selectedSubcategoriesIds = _.map(selectedCategories, 'id');
      const parentIds = _.uniqBy(_.map(selectedCategories, 'parentId'));

      setSelectedCategoriesIds(parentIds);
      setSelectedSubcategoriesIds(selectedSubcategoriesIds);
    }
  }, [categories, searchParams]);

  useEffect(() => {
    const { confirmStatus, action, isOpen } = confirmModalData;

    if (!isOpen) {
      switch (action) {
        case 'placeBet':
          confirmStatus && !_.isEmpty(newBet) && handlePlaceNewBet();
          break;

        case 'deactivateLot':
          confirmStatus &&
            dispatch(
              changeLotStatusByUser({
                lotId: selectedLot.id,
                isActive: false,
              })
            );
          dispatch(clearModalFields('confirmModal'));
          break;

        case 'deactivateLotByAdmin':
          confirmStatus && dispatch(toggleModal('adminMessageModal'));

          break;

        case 'deleteLot':
          dispatch(deleteLot({ id }));
          dispatch(clearModalFields('confirmModal'));
      }
    }
  }, [confirmModalData, newBet]);

  useEffect(() => {
    const { adminMessage } = adminMessageData;

    if (adminMessage) {
      dispatch(
        changeLotStatusByAdmin({
          lotId: selectedLot.id,
          status: 'rejected',
          adminComment: adminMessage,
        })
      );
      dispatch(clearModalFields('adminMessageModal'));
      dispatch(clearModalFields('confirmModal'));
    }
  }, [adminMessageData]);

  useEffect(() => {
    if (!_.isEmpty(bets)) {
      const lastBet = _.maxBy(bets, 'id');
      dispatch(fetchLotDetails(lastBet.lotId));
    }
  }, [bets]);

  useEffect(() => {
    console.log(lots);
  }, [lots]);

  return (
    <div className={styles.lotListContainer}>
      <div className={styles.breadCrumbsContainer}>
        <CustomBreadcrumbs
          categories={categories}
          setSearchParams={setSearchParams}
          setSelectedCategoriesIds={setSelectedCategoriesIds}
          setSelectedSubcategoriesIds={setSelectedSubcategoriesIds}
        />
      </div>
      <div className={styles.contentContainer}>
        <Filters
          categories={categories}
          countries={countries}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          users={users}
          selectedCategoriesIds={selectedCategoriesIds}
          setSelectedCategoriesIds={setSelectedCategoriesIds}
          selectedSubcategoriesIds={selectedSubcategoriesIds}
          setSelectedSubcategoriesIds={setSelectedSubcategoriesIds}
        />

        <div className={styles.lotListWrapp}>
          {lots.map(
            (item) =>
              item.status !== 'inactive' && (
                <ItemCard
                  item={item}
                  key={item.id}
                  setSelectedLot={setSelectedLot}
                />
              )
          )}
        </div>
      </div>
      {selectedLot && (
        <PlaceBetModal
          lot={selectedLot}
          setSelectedLot={setSelectedLot}
          setNewBet={setNewBet}
        />
      )}
    </div>
  );
};

export default LotList;
