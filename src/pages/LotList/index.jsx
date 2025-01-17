import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import _ from 'lodash';

import Filters from '@components/filters';
import ItemCard from '@components/itemCard';
import CustomBreadcrumbs from '@components/customBreadcrumbs';
import PlaceBetModal from '@customModals/placeBetModal';

import { fetchAllCategories } from '@thunks/fetchCategories';
import { fetchCountries } from '@thunks/fetchCountries';
import { filteredLots, fetchLotDetails } from '@thunks/fetchLots';
import { fetchUsers } from '@thunks/fetchUsers';

import { usersListSelector } from '@slices/usersListSlice';
import { categoriesSelector } from '@slices/categoriesSlice';
import { countrySelector } from '@slices/countriesSlice';
import { lotListSelector } from '@slices/lotListSlice';
import { betsSelector } from '@slices/betsSlice';
import { selectModal, toggleModal } from '@slices/modalSlice';
import { getSelectedCurrency } from '@slices/currencySlice';

import { usePlaceNewBet, useFetchDeal } from '@helpers/customHooks/betsHooks';
import {
  useDeactivateLot,
  useDeleteLot,
  useChangeLotStatusByAdmin,
} from '@helpers/customHooks/lotsHooks';

import styles from './lotList.module.scss';

const LotList = () => {
  const dispatch = useDispatch();
  const placeNewBet = usePlaceNewBet();
  const fetchDeal = useFetchDeal();
  const deactivateLot = useDeactivateLot();
  const deleteLot = useDeleteLot();
  const [searchParams, setSearchParams] = useSearchParams();
  const changeLotStatusByAdmin = useChangeLotStatusByAdmin();

  const lots = useSelector(lotListSelector);
  const categories = useSelector(categoriesSelector);
  const bets = useSelector(betsSelector);
  const countries = useSelector(countrySelector);
  const users = useSelector(usersListSelector);
  const userInfo = useSelector((state) => state.usersList.userInfo);
  const confirmModalData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );
  const adminMessageData = useSelector((state) =>
    selectModal(state, 'adminMessageModal')
  );
  const newBet = useSelector((state) => state.bets.newBet);
  const selectedCurrency = useSelector(getSelectedCurrency);

  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState([]);
  const [selectedSubcategoriesIds, setSelectedSubcategoriesIds] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchCountries({ existed: true }));
    dispatch(fetchUsers());
  }, []);

  useEffect(() => {
    if (!selectedCurrency) return;

    dispatch(
      filteredLots({ values: searchParams, currency: selectedCurrency })
    );
  }, [searchParams, selectedCurrency]);

  useEffect(() => {
    if (!_.isEmpty(categories) && searchParams.has('categories')) {
      const searchParamsCategoryIds = searchParams.get('categories');
      const selectedCategories = _.split(searchParamsCategoryIds, ',').map(
        (id) => _.find(categories, { id: _.toNumber(id) })
      );
      const parentIds = _.uniqBy(_.map(selectedCategories, 'id'));

      setSelectedCategoriesIds(parentIds);
    }
  }, [categories, searchParams]);

  useEffect(() => {
    if (searchParams.has('subcategories')) {
      const searchParamsSubcategoryIds = searchParams.get('subcategories');
      const selectedSubcategoriesIds = _.split(
        searchParamsSubcategoryIds,
        ','
      ).map(Number);

      setSelectedSubcategoriesIds(selectedSubcategoriesIds);
    }
  }, [searchParams]);

  useEffect(() => {
    const { confirmStatus, action, isOpen } = confirmModalData;

    if (!isOpen) {
      switch (action) {
        case 'placeBet':
          confirmStatus &&
            newBet &&
            placeNewBet(newBet, selectedLot.originalCurrency);
          break;

        case 'deal':
          confirmStatus &&
            fetchDeal({
              lotId: selectedLot.id,
              userId: userInfo?.id,
              currency: selectedLot.originalCurrency,
            });
          break;

        case 'deactivateLot':
          confirmStatus && deactivateLot(selectedLot.id);
          break;

        case 'deactivateLotByAdmin':
          confirmStatus && dispatch(toggleModal('adminMessageModal'));
          break;

        case 'deleteLot':
          deleteLot({ id: selectedLot.id });
          break;
      }
    }
  }, [confirmModalData]);

  useEffect(() => {
    const { adminMessage } = adminMessageData;

    if (adminMessage) {
      changeLotStatusByAdmin({
        lotId: selectedLot.id,
        status: 'rejected',
        adminMessage,
        selectedCurrency,
      });
    }
  }, [adminMessageData]);

  useEffect(() => {
    if (!_.isEmpty(bets)) {
      const lastBet = _.maxBy(bets, 'id');

      dispatch(
        fetchLotDetails({ id: lastBet.lotId, currency: selectedCurrency })
      );
    }
  }, [bets]);

  useEffect(() => {
    if (searchParams.has('countries')) {
      const searchParamsCountry = searchParams.get('countries');
      const selectedCountries = _.split(searchParamsCountry, ',').map((id) =>
        _.find(countries, { id: _.toNumber(id) })
      );
      const selectedCountriesIds = _.map(selectedCountries, 'id');

      setSelectedCountry(selectedCountriesIds);
    }
  }, [countries, searchParams]);

  useEffect(() => {
    if (searchParams.has('regions')) {
      const searchParamsRegions = searchParams.get('regions');
      const selectedRegions = _.split(searchParamsRegions, ',');

      setSelectedRegions(selectedRegions);
    }
  }, [searchParams]);

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
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          setSelectedRegions={setSelectedRegions}
          selectedRegions={selectedRegions}
        />
        <div className={styles.lotListWrapp}>
          {lots.map((item) => {
            if (item.status !== 'active') return;

            return (
              <ItemCard
                item={item}
                key={item.id}
                setSelectedLot={setSelectedLot}
              />
            );
          })}
        </div>
      </div>
      {selectedLot && (
        <PlaceBetModal lot={selectedLot} setSelectedLot={setSelectedLot} />
      )}
    </div>
  );
};

export default LotList;
