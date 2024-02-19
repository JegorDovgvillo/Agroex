import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

import { selectLotDetailById } from '@slices/lotListSlice';
import { usersListSelector } from '@slices/usersListSlice';
import { selectRootCategories } from '@slices/categoriesSlice';
import { countrySelector } from '@slices/countriesSlice';
import { toggleModal } from '@slices/modalSlice';

import { fetchCountries } from '@thunks/fetchCountries';
import { fetchUsers } from '@thunks/fetchUsers';
import { deleteLot, updateLot } from '@thunks/fetchLots';
import { fetchCategories } from '@thunks/fetchCategories';

import { IMAGE_URL } from '@helpers/endpoints';
import ENDPOINTS from '@helpers/endpoints';

import LotForm from '@components/lotForm';

const MAXIMUM_NUMBER_OF_IMG = import.meta.env.VITE_MAXIMUM_NUMBER_OF_IMG;

const UpdateLot = () => {
  const { id: lotId } = useParams();

  const users = useSelector(usersListSelector);
  const categories = useSelector(selectRootCategories);
  const country = useSelector(countrySelector);
  const selectedLot = useSelector((state) => selectLotDetailById(state, lotId));

  const [confirmStatus, setConfirmStatus] = useState(false);
  const [files, setFiles] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [maxFilesPerDrop, setMaxFilesPerDrop] = useState(MAXIMUM_NUMBER_OF_IMG);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const convertImagesToFiles = async (images) => {
    const files = [];

    for (const { id, name } of images) {
      const URL = `${IMAGE_URL}${ENDPOINTS.IMAGES}`;
      const response = await fetch(`${URL}/${name}`);
      const blob = await response.blob();
      const file = new File([blob], name, { type: 'image/jpeg' });
      file.id = id;
      files.push(file);
    }
    setFiles(files);
  };

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
    convertImagesToFiles(selectedLot?.images || []);
    dispatch(fetchUsers());
    dispatch(fetchCategories());
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleUpdateClick = async (values) => {
    const formData = new FormData();

    const lotData = {
      title: values.title,
      description: values.description,
      variety: 1,
      size: values.size,
      packaging: values.packaging,
      quantity: values.quantity,
      price: values.price,
      currency: values.priceUnits,
      expirationDate: values.expirationDate,
      productCategory: {
        ...(typeof values.subcategory === 'number'
          ? { id: values.subcategory }
          : { title: values.subcategory }),
        parentId: values.category,
      },
      lotType: values.lotType,
      userId: values.userId,
      location: {
        countryId: values.country,
        region: values.region,
      },
    };

    files.forEach((file) => {
      formData.append(`file`, file);
    });

    formData.append('data', JSON.stringify(lotData));

    dispatch(updateLot({ id: lotId, lotData: formData }));
    dispatch(toggleModal('infoModal'));
    setFiles([]);
    navigate(-1);
  };

  const isDataLoaded =
    selectedLot && !_.every([users, categories, country], _.isEmpty);

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
        />
      )}
    </>
  );
};

export default UpdateLot;
