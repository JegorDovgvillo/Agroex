import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

import { selectLotDetailById } from '@slices/lotListSlice';
import { selectRootCategories } from '@slices/categoriesSlice';
import { countrySelector } from '@slices/countriesSlice';
import { tagsSelector } from '@slices/tagsSlice';
import { toggleModal } from '@slices/modalSlice';

import { getUserFromCognito } from '@thunks/fetchUsers';
import { fetchCountries } from '@thunks/fetchCountries';
import { deleteLot, updateLot, fetchLotDetails } from '@thunks/fetchLots';
import { fetchAllCategories } from '@thunks/fetchCategories';
import { fetchTags } from '@thunks/fetchTags';

import convertImagesToFiles from '@helpers/convertImagesToFiles';

import LotForm from '@components/lotForm';

const MAXIMUM_NUMBER_OF_IMG = import.meta.env.VITE_MAXIMUM_NUMBER_OF_IMG;

const UpdateLot = () => {
  const { id: lotId } = useParams();

  const categories = useSelector(selectRootCategories);
  const country = useSelector(countrySelector);
  const selectedLot = useSelector((state) => selectLotDetailById(state, lotId));
  const tags = useSelector(tagsSelector);
  const userId = useSelector((state) => state.usersList.userId);
  const countryCoordinate = useSelector(
    (state) => state.countries.countryCoordinate
  );

  const [confirmStatus, setConfirmStatus] = useState(false);
  const [files, setFiles] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [maxFilesPerDrop, setMaxFilesPerDrop] = useState(MAXIMUM_NUMBER_OF_IMG);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showConfirm = () => {
    dispatch(toggleModal('confirmModal'));
  };

  useEffect(() => {
    if (confirmStatus) {
      dispatch(deleteLot({ id: lotId }));
      navigate(-1);
      setConfirmStatus(false);
    }
  }, [confirmStatus]);

  useEffect(() => {
    convertImagesToFiles(selectedLot?.images || [], setFiles);
    dispatch(fetchLotDetails(lotId));
    dispatch(fetchAllCategories());
    dispatch(getUserFromCognito());
    dispatch(fetchCountries());
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
      variety: 1,
      size: values.size,
      packaging: values.packaging,
      duration: values.duration,
      quantity: values.quantity,
      originalPrice: values.price,
      originalMinPrice: values.minPrice,
      originalCurrency: values.priceUnits,
      expirationDate: values.expirationDate,
      productCategory: {
        ...subcategory,
        parentId: values.category,
      },
      lotType: values.lotType,
      userId: userId.sub,
      location: {
        countryId: values.country,
        region: values.region,
        latitude: countryCoordinate.lat,
        longitude: countryCoordinate.lon,
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

    dispatch(updateLot({ id: lotId, lotData: formData }));
    dispatch(toggleModal('infoModal'));
    setFiles([]);
    navigate(-1);
  };

  const isDataLoaded =
    selectedLot &&
    _.every(
      [categories, country, tags],
      (arr) => _.isArray(arr) && !_.isEmpty(arr)
    );

  return (
    <>
      {isDataLoaded && (
        <LotForm
          selectedLot={selectedLot}
          handleSubmitClick={handleUpdateClick}
          country={country}
          categories={categories}
          formType="update"
          setConfirmStatus={setConfirmStatus}
          showConfirm={showConfirm}
          files={files}
          setFiles={setFiles}
          maxFilesPerDrop={maxFilesPerDrop}
          setMaxFilesPerDrop={setMaxFilesPerDrop}
          disabled={disabled}
          setDisabled={setDisabled}
          isImageAdded={files.length > 0}
          tags={tags}
        />
      )}
    </>
  );
};

export default UpdateLot;
