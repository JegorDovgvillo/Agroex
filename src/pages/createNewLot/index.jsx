import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

import { fetchUsers } from '@thunks/fetchUsers';
import { fetchCategories } from '@thunks/fetchCategories';
import { fetchCountries } from '@thunks/fetchCountries';
import { fetchTags } from '@thunks/fetchTags';
import { createLot } from '@thunks/fetchLots';

import { usersListSelector } from '@slices/usersListSlice';
import { tagsSelector } from '@slices/tagsSlice';
import { toggleModal } from '@slices/modalSlice';
import { selectRootCategories } from '@slices/categoriesSlice';
import { countrySelector } from '@slices/countriesSlice';

import LotForm from '@components/lotForm';
import { withAuthenticator } from '@aws-amplify/ui-react';

const MAXIMUM_NUMBER_OF_IMG = import.meta.env.VITE_MAXIMUM_NUMBER_OF_IMG;

const CreateNewLot = () => {
  const users = useSelector(usersListSelector);
  const categories = useSelector(selectRootCategories);
  const country = useSelector(countrySelector);
  const tags = useSelector(tagsSelector);

  const [files, setFiles] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [maxFilesPerDrop, setMaxFilesPerDrop] = useState(MAXIMUM_NUMBER_OF_IMG);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchCategories());
    dispatch(fetchCountries());
    dispatch(fetchTags());
  }, [dispatch]);

  const handleSubmitClick = async (values, resetForm) => {
    const formData = new FormData();
    const subcategory =
      typeof values.subcategory === 'number'
        ? { id: values.subcategory }
        : { title: values.subcategory };

    const lotData = {
      title: values.title,
      description: values.description,
      variety: 1,
      size: values.size,
      packaging: values.packaging,
      duration: values.duration,
      quantity: values.quantity,
      price: values.price,
      minPrice: values.minPrice,
      currency: values.priceUnits,
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
    };

    files.forEach((file) => {
      formData.append(file, file);
    });

    formData.append('data', JSON.stringify(lotData));

    dispatch(createLot(formData));
    dispatch(toggleModal('infoModal'));
    setFiles([]);
    resetForm();
  };

  const isDataLoaded = _.every(
    [users, categories, country, tags],
    (arr) => !_.isEmpty(arr)
  );

  return (
    <>
      {isDataLoaded && (
        <LotForm
          handleSubmitClick={handleSubmitClick}
          country={country}
          categories={categories}
          users={users}
          formType="create"
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

export default withAuthenticator(CreateNewLot);
