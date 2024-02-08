import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { usersListSelector } from '@slices/usersListSlice';
import { toggleModal } from '@slices/modalSlice';
import { categoriesSelector } from '@slices/categoriesSlice';
import { countrySelector } from '@slices/countriesSlice';

import { fetchCategories } from '@thunks/fetchCategories';
import { fetchUsers } from '@thunks/fetchUsers';
import { fetchCountries } from '@thunks/fetchCountries';
import { createLot } from '@thunks/fetchLots';

import LotForm from '@components/lotForm';

const CreateNewLot = () => {
  const dispatch = useDispatch();
  const users = useSelector(usersListSelector);
  const categories = useSelector(categoriesSelector);
  const country = useSelector(countrySelector);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchCategories());
    dispatch(fetchCountries());
  }, [dispatch]);

  const initialValues = {
    userId: '',
    title: '',
    country: '',
    region: '',
    category: '',
    subcategory: '',
    variety: '',
    description: '',
    packaging: '',
    quantity: '',
    price: '',
    priceUnits: 'USD',
    lotType: '',
    size: '',
    expirationDate: '',
  };

  const handleSubmitClick = async (values, selectedFiles, resetForm) => {
    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`file`, file);
    });
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
    formData.append('data', JSON.stringify(lotData));
    dispatch(createLot(formData));
    dispatch(toggleModal('infoModal'));
    resetForm();
  };

  return (
    <LotForm
      initialValues={initialValues}
      handleSubmitClick={handleSubmitClick}
      country={country}
      categories={categories}
      users={users}
      formType="create"
    />
  );
};

export default CreateNewLot;
