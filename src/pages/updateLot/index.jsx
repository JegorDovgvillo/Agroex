import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectLotDetailById } from '@slices/lotListSlice';
import { usersListSelector } from '@slices/usersListSlice';
import { categoriesSelector } from '@slices/categoriesSlice';
import { countrySelector } from '@slices/countriesSlice';
import { toggleModal } from '@slices/modalSlice';

import { fetchCountries } from '@thunks/fetchCountries';
import { fetchUsers } from '@thunks/fetchUsers';
import { deleteLot, updateLot } from '@thunks/fetchLots';
import { fetchCategories } from '@thunks/fetchCategories';

import LotForm from '@components/lotForm';

const UpdateLot = () => {
  const { id: lotId } = useParams();
  const MAXIMUM_NUMBER_OF_IMG = import.meta.env.VITE_MAXIMUM_NUMBER_OF_IMG;

  const users = useSelector(usersListSelector);
  const categories = useSelector(categoriesSelector);
  const country = useSelector(countrySelector);
  const selectedLot = useSelector((state) => selectLotDetailById(state, lotId));

  const [confirmStatus, setConfirmStatus] = useState(false);
  const [files, setFiles] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [maxFilesPerDrop, setMaxFilesPerDrop] = useState(MAXIMUM_NUMBER_OF_IMG);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const convertImagesToFiles = (images) => {
    const files = [];

    images.forEach((images) => {
      const { id, name } = images;
      const file = new File([], name, { type: 'image/jpeg' });
      file.id = id;
      files.push(file);
    });

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

  const initialValues = {
    userId: selectedLot?.userId || '',
    title: selectedLot?.title || '',
    country: selectedLot?.location.countryId || '',
    region: selectedLot.location?.region || '',
    category: selectedLot?.productCategoryId || '',
    subcategory: selectedLot?.subcategory || '',
    variety: selectedLot?.variety || '',
    description: selectedLot?.description || '',
    packaging: selectedLot?.packaging || '',
    quantity: selectedLot?.quantity || '',
    price: selectedLot?.pricePerTon * selectedLot?.quantity || '',
    priceUnits: 'USD',
    lotType: selectedLot?.lotType || '',
    size: selectedLot?.size || '',
    expirationDate: selectedLot?.expirationDate || '',
  };

  const handleUpdateClick = async (values) => {
    const formData = new FormData();
    const lotData = {
      title: values.title,
      description: values.description,
      variety: 1,
      size: values.size,
      packaging: values.packaging,
      quantity: values.quantity,
      pricePerTon: (values.price / values.quantity).toFixed(2),
      currency: values.priceUnits,
      expirationDate: values.expirationDate,
      productCategoryId: values.category,
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

  return (
    <LotForm
      initialValues={initialValues}
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
    />
  );
};

export default UpdateLot;
