import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';

import { compact, uniqBy, find, filter } from 'lodash';
import { Breadcrumbs, Typography } from '@mui/material';

import ROUTES from '@helpers/routeNames';
import { selectCategoryById } from '@slices/categoriesSlice';

import styles from './customBreadcrumbs.module.scss';
import { useSelector } from 'react-redux';

const { container, link } = styles;

const { LOTS } = ROUTES;

const CustomBreadcrumbs = ({
  lot = [],
  categories,
  setIsCategoryFieldVisible,
  setIsSubcategoryFieldVisible,
  setSearchParams,
  setSelectedCategoriesIds,
  setSelectedSubcategoriesIds,
}) => {
  const navigate = useNavigate();
  const { id: lotId } = useParams();
  const [searchParams] = useSearchParams();
  const categoryIds = searchParams.get('categories');

  const currCategories = categoryIds
    ?.split(',')
    .map((id) => categories.find((cat) => cat.id === Number(id)));

  const categoryId =
    uniqBy(currCategories, 'parentId').length === 1
      ? currCategories[0]?.parentId
      : false;

  const category = lotId
    ? find(categories, ['id', lot.productCategory.parentId])
    : useSelector((state) => selectCategoryById(state, categoryId));

  const isOneSubcategory = currCategories?.length === 1 && categoryId;

  const subcategory =
    (isOneSubcategory && currCategories[0]) ||
    find(categories, ['id', lot.productCategory?.id]);

  const getPath = ({ category, subcategory }) => {
    const categoryId = find(categories, ['title', category || subcategory])?.id;

    const subcategories = filter(categories, [
      category ? 'parentId' : 'id',
      categoryId,
    ]);

    const params = ['categories', subcategories.map((cat) => cat.id)];
    setSearchParams([params]);
  };

  const rootPart = {
    id: 1,
    link: `${LOTS}`,
    value: { title: 'Lots' },
  };

  const categoryPart = category && {
    id: 2,
    link: null,
    value: category,
  };

  const subcategoryPart = subcategory && {
    id: 3,
    link: null,
    value: subcategory,
  };

  const lotIdPart = lotId && {
    id: 4,
    link: null,
    value: { title: lot.title },
  };

  const breadcrumbs = compact([
    rootPart,
    categoryPart,
    subcategoryPart,
    lotIdPart,
  ]);

  const handleClick = ({ id, value }) => {
    switch (id) {
      case 1:
        !lotId && setIsCategoryFieldVisible(true);
        !lotId && setSearchParams('');
        !lotId && setSelectedCategoriesIds([]);
        navigate(LOTS);

        break;
      case 2:
        !lotId && setIsSubcategoryFieldVisible(true);
        lotId && navigate(LOTS);
        getPath({ category: value.title });

        !lotId && setSelectedCategoriesIds([value.id]);
        !lotId && setSelectedSubcategoriesIds([]);

        break;
      case 3:
        lotId && navigate(LOTS);
        getPath({ subcategory: value.title });

        break;
    }
  };

  useEffect(() => {
    if (!lotId) {
      setIsCategoryFieldVisible(!categoryId);
      setIsSubcategoryFieldVisible(!subcategory);
    }
  }, [category, subcategory]);

  return (
    <div role="presentation" className={container}>
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((el, index) =>
          index !== breadcrumbs.length - 1 ? (
            <Typography
              key={el.id}
              underline="hover"
              color="inherit"
              className={link}
              onClick={() => handleClick({ ...el })}
            >
              {el.value.title}
            </Typography>
          ) : (
            <Typography key={el.id} color="text.primary">
              {el.value.title}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </div>
  );
};

export default CustomBreadcrumbs;
