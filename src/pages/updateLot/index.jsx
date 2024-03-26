import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

import { selectLotDetailById, clearStatus } from '@slices/lotListSlice';
import { selectRootCategories } from '@slices/categoriesSlice';
import { countrySelector } from '@slices/countriesSlice';
import { tagsSelector } from '@slices/tagsSlice';
import {
  toggleModal,
  setModalFields,
  selectModal,
  clearModalsFields,
} from '@slices/modalSlice';
import { getSelectedCurrency } from '@slices/currencySlice';

import { fetchCountries } from '@thunks/fetchCountries';
import { deleteLot, updateLot, fetchLotDetails } from '@thunks/fetchLots';
import { fetchAllCategories } from '@thunks/fetchCategories';
import { fetchTags } from '@thunks/fetchTags';

import convertImagesToFiles from '@helpers/convertImagesToFiles';
import ROUTES from '@helpers/routeNames';

import LotForm from '@components/lotForm';

const MAXIMUM_NUMBER_OF_IMG = import.meta.env.VITE_MAXIMUM_NUMBER_OF_IMG;
const { NOT_FOUND } = ROUTES;

const UpdateLot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: lotId } = useParams();

  const categories = useSelector(selectRootCategories);
  const categoriesLoadingStatus = useSelector(
    (state) => state.categories.fetchAllCategoriesStatus
  );
  const countries = useSelector(countrySelector);
  const countriesLoadingStatus = useSelector(
    (state) => state.countries.fetchCountriesStatus
  );
  const selectedLot = useSelector((state) => selectLotDetailById(state, lotId));
  const selectedLotLoadingStatus = useSelector(
    (state) => state.lotList.loadingStatus
  );
  const tags = useSelector(tagsSelector);
  const tagsLoadingStatus = useSelector((state) => state.tags.fetchTagsStatus);
  const userId = useSelector((state) => state.usersList.userInfo);
  const selectedCountry = useSelector(
    (state) => state.countries.markerCoordinate
  );
  const selectedCurrency = useSelector(getSelectedCurrency);
  const updateLotStatus = useSelector((state) => state.lotList.updateLotStatus);
  const deleteLotStatus = useSelector((state) => state.lotList.deleteLotStatus);
  const confirmModalData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );
  const snackbarData = useSelector((state) => selectModal(state, 'snackbar'));
  const submitErrorMessage = useSelector(
    (state) => state.lotList.errors?.message
  );
  const [isDataLoaded, setIsDataLoaded] = useState(null);

  const [files, setFiles] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [maxFilesPerDrop, setMaxFilesPerDrop] = useState(MAXIMUM_NUMBER_OF_IMG);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);

  const showConfirm = () => {
    dispatch(
      setModalFields({
        modalId: 'confirmModal',
        text: 'This action delete the lot. Do you confirm the action?',
      })
    );
    dispatch(toggleModal('confirmModal'));
  };

  const handleUpdateClick = async (values) => {
    const formData = new FormData();

    const subcategory =
      typeof values.subcategory === 'number'
        ? { id: values.subcategory }
        : { title: values.subcategory };

    const filteredImages = _.filter(selectedLot?.images, (image) =>
      _.some(files, { id: image.id })
    );

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
      images: filteredImages,
      bets: values.bets,
    };

    files.forEach((file) => {
      const { id } = file;
      const isImageNew = !_.some(selectedLot?.images, { id });
      isImageNew && formData.append(`file`, file);
    });

    formData.append('data', JSON.stringify(lotData));

    dispatch(
      updateLot({ id: lotId, lotData: formData, currency: selectedCurrency })
    );
  };

  useEffect(() => {
    dispatch(fetchLotDetails({ id: lotId, currency: selectedCurrency }));
    dispatch(fetchAllCategories());
    dispatch(fetchCountries({ existed: false }));
    dispatch(fetchTags());
  }, [dispatch]);

  useEffect(() => {
    if (_.includes(['rejected', 'fulfilled'], selectedLotLoadingStatus)) return;

    if (!selectedLot) navigate(`/${NOT_FOUND}`);

    convertImagesToFiles(selectedLot?.images || [], setFiles);
  }, [selectedLot, selectedLotLoadingStatus]);

  useEffect(() => {
    const { confirmStatus, isOpen } = confirmModalData;

    if (!confirmStatus || isOpen) return;

    dispatch(deleteLot({ id: lotId }));
    dispatch(clearModalsFields('confirmModal'));
  }, [confirmModalData]);

  useEffect(() => {
    switch (updateLotStatus) {
      case 'fulfilled':
        dispatch(
          setModalFields({
            modalId: 'snackbar',
            message: 'Your lot has been successfully updated',
            severity: 'success',
            isOpen: true,
          })
        );
        setFiles([]);
        navigate(-1);
        dispatch(clearStatus('updateLotStatus'));
        break;

      case 'rejected':
        dispatch(
          setModalFields({
            modalId: 'snackbar',
            message: submitErrorMessage,
            severity: 'error',
            isOpen: true,
          })
        );
        break;
    }
  }, [updateLotStatus]);

  useEffect(() => {
    switch (deleteLotStatus) {
      case 'fulfilled':
        dispatch(
          setModalFields({
            modalId: 'snackbar',
            message: 'Your lot has been successfully deleted',
            severity: 'success',
            isOpen: true,
          })
        );
        navigate(-1);
        dispatch(clearStatus('deleteLotStatus'));
        break;

      case 'rejected':
        dispatch(
          setModalFields({
            modalId: 'snackbar',
            message: submitErrorMessage,
            severity: 'error',
            isOpen: true,
          })
        );
        break;
    }
  }, [deleteLotStatus]);

  useEffect(() => {
    const { isOpen, message } = snackbarData;

    if (isOpen || !message) return;

    clearModalsFields('snackbar');
  }, [snackbarData]);

  useEffect(() => {
    if (
      !_.every(
        [categoriesLoadingStatus, countriesLoadingStatus, tagsLoadingStatus],
        (status) => _.includes(['fulfilled', 'rejected'], status)
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
          selectedLot={selectedLot}
          handleSubmitClick={handleUpdateClick}
          country={countries}
          categories={categories}
          formType="update"
          showConfirm={showConfirm}
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
        />
      )}
    </>
  );
};

export default UpdateLot;
