import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

import { fetchAllCategories } from '@thunks/fetchCategories';
import { fetchCountries } from '@thunks/fetchCountries';
import { fetchTags } from '@thunks/fetchTags';
import { createLot } from '@thunks/fetchLots';

import { tagsSelector } from '@slices/tagsSlice';
import { setModalFields } from '@slices/modalSlice';
import { selectRootCategories } from '@slices/categoriesSlice';
import { countrySelector } from '@slices/countriesSlice';
import { getSelectedCurrency } from '@slices/currencySlice';

import LotForm from '@components/lotForm';
import ROUTES from '@helpers/routeNames';
import { snackbarTitles } from '@helpers/fetchResultMessages';

const MAXIMUM_NUMBER_OF_IMG = import.meta.env.VITE_MAXIMUM_NUMBER_OF_IMG;
const { NOT_FOUND } = ROUTES;
const { successLotCreate } = snackbarTitles;

const CreateNewLot = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector(selectRootCategories);
  const countries = useSelector(countrySelector);
  const tags = useSelector(tagsSelector);
  const userId = useSelector((state) => state.usersList.userInfo);
  const selectedCountry = useSelector(
    (state) => state.countries.markerCoordinate
  );
  const selectedCurrency = useSelector(getSelectedCurrency);

  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [files, setFiles] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [maxFilesPerDrop, setMaxFilesPerDrop] = useState(MAXIMUM_NUMBER_OF_IMG);
  const [isDataFetched, setIsDataFetched] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(null);

  useEffect(() => {
    (async () => {
      const resultFetchCategories = await dispatch(fetchAllCategories());
      const resultFetchCountries = await dispatch(
        fetchCountries({ existed: false })
      );
      const resultFetchTags = await dispatch(fetchTags());

      const isCategoriesLoaded = fetchAllCategories.fulfilled.match(
        resultFetchCategories
      );
      const isCountriesLoaded =
        fetchCountries.fulfilled.match(resultFetchCountries);
      const isTagsLoaded = fetchTags.fulfilled.match(resultFetchTags);

      setIsDataFetched(
        _.every([isCategoriesLoaded, isCountriesLoaded, isTagsLoaded])
      );
    })();
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

    files.forEach((file) => {
      formData.append('file', file);
    });

    formData.append('data', JSON.stringify(lotData));

    const resultAction = await dispatch(
      createLot({ formData, currency: selectedCurrency })
    );

    if (createLot.fulfilled.match(resultAction)) {
      dispatch(
        setModalFields({
          modalId: 'snackbar',
          message: successLotCreate,
          severity: 'success',
          isOpen: true,
        })
      );
      navigate(-1);
    }
  };

  useEffect(() => {
    if (!isDataFetched) return;

    const isAllDataLoaded = _.every(
      [categories, countries, tags],
      (item) => !_.isEmpty(item)
    );

    isAllDataLoaded
      ? setIsDataLoaded(isAllDataLoaded)
      : navigate(`/${NOT_FOUND}`);
  }, [categories, tags, countries, isDataFetched]);

  useEffect(() => {
    if (_.isNull(isDataLoaded) || isDataLoaded) return;

    navigate(`/${NOT_FOUND}`);
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
        />
      )}
    </>
  );
};

export default CreateNewLot;
