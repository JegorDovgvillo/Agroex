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

const MAXIMUM_NUMBER_OF_IMG = import.meta.env.VITE_MAXIMUM_NUMBER_OF_IMG;

const CreateNewLot = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector(selectRootCategories);
  const country = useSelector(countrySelector);
  const tags = useSelector(tagsSelector);
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

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchCountries({ existed: false }));
    dispatch(fetchTags());
  }, [dispatch]);

  const handleSubmitClick = async (values) => {
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
    console.log(lotData);
    files.forEach((file) => {
      formData.append('file', file);
    });

    formData.append('data', JSON.stringify(lotData));

    dispatch(createLot({ formData, currency: selectedCurrency }));
  };

  useEffect(() => {
    switch (createLotStatus) {
      case 'fulfilled':
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

  const isDataLoaded = _.every(
    [categories, country, tags],
    (arr) => !_.isEmpty(arr)
  );

  return (
    <>
      {isDataLoaded && (
        <LotForm
          handleSubmitClick={handleSubmitClick}
          country={country}
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
        />
      )}
    </>
  );
};

export default CreateNewLot;
