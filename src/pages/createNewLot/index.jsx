import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

import { fetchAllCategories } from '@thunks/fetchCategories';
import { fetchCountries } from '@thunks/fetchCountries';
import { fetchTags } from '@thunks/fetchTags';
import { createLot } from '@thunks/fetchLots';

import { tagsSelector } from '@slices/tagsSlice';
import {
  toggleModal,
  setModalFields,
  clearModalsFields,
  selectModal,
} from '@slices/modalSlice';
import { selectRootCategories } from '@slices/categoriesSlice';
import { countrySelector } from '@slices/countriesSlice';
import { clearStatus } from '@slices/lotListSlice';
import { getSelectedCurrency } from '@slices/currencySlice';

import LotForm from '@components/lotForm';
import ROUTES from '@helpers/routeNames';

const MAXIMUM_NUMBER_OF_IMG = import.meta.env.VITE_MAXIMUM_NUMBER_OF_IMG;
const { NOT_FOUND } = ROUTES;

const CreateNewLot = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector(selectRootCategories);
  const categoriesLoadingStatus = useSelector(
    (state) => state.categories.fetchAllCategoriesStatus
  );
  const countries = useSelector(countrySelector);
  const countriesLoadingStatus = useSelector(
    (state) => state.countries.fetchCountriesStatus
  );
  const tags = useSelector(tagsSelector);
  const tagsLoadingStatus = useSelector((state) => state.tags.fetchTagsStatus);
  const userId = useSelector((state) => state.usersList.userInfo);
  const selectedCountry = useSelector(
    (state) => state.countries.markerCoordinate
  );
  const createLotStatus = useSelector((state) => state.lotList.createLotStatus);
  const selectedCurrency = useSelector(getSelectedCurrency);
  const snackbarData = useSelector((state) => selectModal(state, 'snackbar'));
  const submitErrorMessage = useSelector(
    (state) => state.lotList.errors?.message
  );

  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [files, setFiles] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [maxFilesPerDrop, setMaxFilesPerDrop] = useState(MAXIMUM_NUMBER_OF_IMG);
  const [loading, setLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(null);

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchCountries({ existed: false }));
    dispatch(fetchTags());
  }, [dispatch]);

  const handleSubmitClick = async (values) => {
    setLoading(true);
    const formData = new FormData();

    const subcategory =
      typeof values.subcategory === 'number'
        ? { id: values.subcategory }
        : { title: values.subcategory };

    const lotData = {
      title: values.title,
      description: values.description,
      variety: values.variety,
      size: values.size,
      packaging: values.packaging,
      duration: values.duration,
      quantity: values.quantity,
      originalPrice: values.originalPrice,
      originalMinPrice: values.originalMinPrice,
      originalCurrency: values.originalCurrency,
      expirationDate: values.expirationDate,
      productCategory: {
        ...subcategory,
        parentId: values.productCategory,
      },
      lotType: values.lotType,
      userId: userId.sub,
      location: {
        countryId: values.country,
        region: values.region,
        latitude: markerCoordinate.lat,
        longitude: markerCoordinate.lon,
      },
      tags: values.tags,
    };

    files.forEach((file) => {
      formData.append('file', file);
    });

    formData.append('data', JSON.stringify(lotData));

    dispatch(createLot({ formData, currency: selectedCurrency }));
  };

  useEffect(() => {
    switch (createLotStatus) {
      case 'fulfilled':
        setLoading(false);
        dispatch(
          setModalFields({
            modalId: 'snackbar',
            message: 'Your lot has been successfully added',
            severity: 'success',
          })
        );
        dispatch(toggleModal('snackbar'));
        navigate(-1);
        dispatch(clearStatus('createLotStatus'));
        break;

      case 'rejected':
        setLoading(false);
        dispatch(
          setModalFields({
            modalId: 'snackbar',
            message: submitErrorMessage,
            severity: 'error',
          })
        );
        dispatch(toggleModal('snackbar'));
        break;
    }
  }, [createLotStatus]);

  useEffect(() => {
    const { isOpen, message } = snackbarData;

    if (isOpen || !message) return;

    clearModalsFields('snackbar');
  }, [snackbarData]);

  useEffect(() => {
    if (
      !_.every(
        [categoriesLoadingStatus, countriesLoadingStatus, tagsLoadingStatus],
        (status) => status === 'fulfilled' || status === 'rejected'
      )
    ) {
      return;
    }

    const isCategoriesLoaded =
      categoriesLoadingStatus === 'fulfilled' && !_.isEmpty(categories);
    const isCountriesLoaded =
      countriesLoadingStatus === 'fulfilled' && !_.isEmpty(countries);
    const isTagsLoaded = tagsLoadingStatus === 'fulfilled' && !_.isEmpty(tags);

    setIsDataLoaded(
      _.every([isCategoriesLoaded, isCountriesLoaded, isTagsLoaded])
    );
  }, [
    categories,
    categoriesLoadingStatus,
    tags,
    tagsLoadingStatus,
    countries,
    countriesLoadingStatus,
  ]);

  useEffect(() => {
    if (_.isNull(isDataLoaded)) return;

    if (!isDataLoaded) navigate(`/${NOT_FOUND}`);
  }, [isDataLoaded]);

  return (
    <>
      {isDataLoaded && (
        <LotForm
          handleSubmitClick={handleSubmitClick}
          country={countries}
          categories={categories}
          formType="create"
          files={files}
          setFiles={setFiles}
          maxFilesPerDrop={maxFilesPerDrop}
          setMaxFilesPerDrop={setMaxFilesPerDrop}
          disabled={disabled}
          setDisabled={setDisabled}
          isImageAdded={files.length > 0}
          tags={tags}
          markerCoordinate={markerCoordinate}
          setMarkerCoordinate={setMarkerCoordinate}
          selectedCountry={selectedCountry}
          loading={loading}
        />
      )}
    </>
  );
};

export default CreateNewLot;
