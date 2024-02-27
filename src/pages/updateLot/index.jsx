import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

import { selectLotDetailById } from '@slices/lotListSlice';
import { usersListSelector } from '@slices/usersListSlice';
import { selectRootCategories } from '@slices/categoriesSlice';
import { countrySelector } from '@slices/countriesSlice';
import { tagsSelector } from '@slices/tagsSlice';
import { toggleModal } from '@slices/modalSlice';

import { fetchCountries } from '@thunks/fetchCountries';
import { fetchUsers } from '@thunks/fetchUsers';
import { deleteLot, updateLot, fetchLotDetails } from '@thunks/fetchLots';
import { fetchAllCategories } from '@thunks/fetchCategories';
import { fetchTags } from '@thunks/fetchTags';

import convertImagesToFiles from '@helpers/convertImagesToFiles';

import LotForm from '@components/lotForm';

const MAXIMUM_NUMBER_OF_IMG = import.meta.env.VITE_MAXIMUM_NUMBER_OF_IMG;

const UpdateLot = () => {
  const { id: lotId } = useParams();

  const users = useSelector(usersListSelector);
  const categories = useSelector(selectRootCategories);
  const country = useSelector(countrySelector);
  const selectedLot = useSelector((state) => selectLotDetailById(state, lotId));
  const tags = useSelector(tagsSelector);

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
    dispatch(fetchUsers());
    dispatch(fetchAllCategories());
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
      userId: values.userId,
      location: {
        countryId: values.country,
        region: values.region,
      },
      tags: values.tags,
      images: filteredImages,
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
      [users, categories, country, tags],
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
          users={users}
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
