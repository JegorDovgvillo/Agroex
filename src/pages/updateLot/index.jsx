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
import { snackbarTitles } from '@helpers/fetchResultMessages';

import LotForm from '@components/lotForm';

const MAXIMUM_NUMBER_OF_IMG = import.meta.env.VITE_MAXIMUM_NUMBER_OF_IMG;
const { NOT_FOUND } = ROUTES;
const { successLotUpdate, successLotDelete } = snackbarTitles;

const UpdateLot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: lotId } = useParams();

  const categories = useSelector(selectRootCategories);
  const countries = useSelector(countrySelector);
  const selectedLot = useSelector((state) => selectLotDetailById(state, lotId));
  const tags = useSelector(tagsSelector);
  const userId = useSelector((state) => state.usersList.userInfo);
  const selectedCountry = useSelector(
    (state) => state.countries.markerCoordinate
  );
  const selectedCurrency = useSelector(getSelectedCurrency);
  const confirmModalData = useSelector((state) =>
    selectModal(state, 'confirmModal')
  );

  const [isDataFetched, setIsDataFetched] = useState(null);
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
        isOpen: true,
      })
    );
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

    const resultAction = await dispatch(
      updateLot({ id: lotId, lotData: formData, currency: selectedCurrency })
    );

    if (updateLot.fulfilled.match(resultAction)) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: successLotUpdate,
          severity: 'success',
          isOpen: true,
        })
      );
      setFiles([]);
      navigate(-1);
    }
  };

  useEffect(() => {
    (async () => {
      const resultFetchLotDetails = await dispatch(
        fetchLotDetails({ id: lotId, currency: selectedCurrency })
      );
      const resultFetchCategories = await dispatch(fetchAllCategories());
      const resultFetchCountries = await dispatch(
        fetchCountries({ existed: false })
      );
      const resultFetchTags = await dispatch(fetchTags());

      const isLotDetailsLoaded = fetchLotDetails.fulfilled.match(
        resultFetchLotDetails
      );
      const isCategoriesLoaded = fetchAllCategories.fulfilled.match(
        resultFetchCategories
      );
      const isCountriesLoaded =
        fetchCountries.fulfilled.match(resultFetchCountries);
      const isTagsLoaded = fetchTags.fulfilled.match(resultFetchTags);

      if (!isLotDetailsLoaded) navigate(`/${NOT_FOUND}`);

      setIsDataFetched(
        _.every([isCategoriesLoaded, isCountriesLoaded, isTagsLoaded])
      );
    })();
  }, [dispatch]);

  useEffect(() => {
    const { confirmStatus, isOpen } = confirmModalData;

    if (!confirmStatus || isOpen) return;

    const resultAction = (async () =>
      await dispatch(deleteLot({ id: lotId })))();

    if (deleteLot.fulfilled.match(resultAction)) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: successLotDelete,
          severity: 'success',
          isOpen: true,
        })
      );
      setFiles([]);
      navigate(-1);
    }

    dispatch(clearModalsFields('confirmModal'));
  }, [confirmModalData]);

  useEffect(() => {
    if (!isDataFetched || !selectedLot) return;

    convertImagesToFiles(selectedLot.images || [], setFiles);

    const isAllDataLoaded = _.every(
      [categories, countries, tags],
      (item) => !_.isEmpty(item)
    );

    isAllDataLoaded
      ? setIsDataLoaded(isAllDataLoaded)
      : navigate(`/${NOT_FOUND}`);
  }, [selectedLot, categories, tags, countries, isDataFetched]);

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
