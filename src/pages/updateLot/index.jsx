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

import LotForm from '@components/lotForm';

const MAXIMUM_NUMBER_OF_IMG = import.meta.env.VITE_MAXIMUM_NUMBER_OF_IMG;

const UpdateLot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: lotId } = useParams();

  const categories = useSelector(selectRootCategories);
  const country = useSelector(countrySelector);
  const selectedLot = useSelector((state) => selectLotDetailById(state, lotId));
  const tags = useSelector(tagsSelector);
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

  useEffect(() => {
    const { confirmStatus, isOpen } = confirmModalData;

    if (!confirmStatus || isOpen) return;

    dispatch(deleteLot({ id: lotId }));
    dispatch(clearModalsFields('confirmModal'));
  }, [confirmModalData]);

  useEffect(() => {
    if (!selectedLot) return;

    convertImagesToFiles(selectedLot.images || [], setFiles);
  }, [selectedLot]);

  useEffect(() => {
    dispatch(fetchLotDetails({ id: lotId, currency: selectedCurrency }));
    dispatch(fetchAllCategories());
    dispatch(fetchCountries({ existed: false }));
    dispatch(fetchTags());
  }, [dispatch]);

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

  const isDataLoaded =
    selectedLot &&
    _.every(
      [categories, country, tags],
      (arr) => _.isArray(arr) && !_.isEmpty(arr)
    );

  useEffect(() => {
    switch (updateLotStatus) {
      case 'fulfilled':
        dispatch(
          setModalFields({
            modalId: 'snackbar',
            message: 'Your lot has been successfully updated',
            severity: 'success',
          })
        );
        dispatch(toggleModal('snackbar'));
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
          })
        );
        dispatch(toggleModal('snackbar'));
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
          })
        );
        dispatch(toggleModal('snackbar'));
        navigate(-1);
        dispatch(clearStatus('deleteLotStatus'));
        break;

      case 'rejected':
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
  }, [deleteLotStatus]);

  useEffect(() => {
    const { isOpen, message } = snackbarData;

    if (isOpen || !message) return;

    clearModalsFields('snackbar');
  }, [snackbarData]);

  return (
    <>
      {isDataLoaded && (
        <LotForm
          selectedLot={selectedLot}
          handleSubmitClick={handleUpdateClick}
          country={country}
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
