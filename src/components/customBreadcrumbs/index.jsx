import { useNavigate, useSearchParams, useParams } from 'react-router-dom';

import { compact, uniqBy, find, filter, toNumber, chain, map } from 'lodash';
import { Breadcrumbs, Typography } from '@mui/material';

import ROUTES from '@helpers/routeNames';

import styles from './customBreadcrumbs.module.scss';

const { container, link } = styles;

const { LOTS } = ROUTES;

const CustomBreadcrumbs = ({
  lot: { productCategory, title } = {},
  categories,
  setSearchParams,

  setSelectedCategoriesIds,
  setSelectedSubcategoriesIds,
}) => {
  const navigate = useNavigate();
  const { id: lotId } = useParams();
  const [searchParams] = useSearchParams();

  const searchParamsCategoryIds = searchParams.get('categories');

  const currSearchedCategories = chain(searchParamsCategoryIds)
    .split(',')
    .map((id) => find(categories, { id: toNumber(id) }))
    .value();

  const isOnlyOneParentCategory =
    uniqBy(currSearchedCategories, 'parentId').length === 1;
  const parentCategoryId =
    isOnlyOneParentCategory && currSearchedCategories[0]?.parentId;
  const parentCategory = find(categories, [
    'id',
    lotId ? productCategory.parentId : parentCategoryId,
  ]);

  const isOnlyOneSubcategory = currSearchedCategories?.length === 1;
  const subcategory =
    (isOnlyOneSubcategory && currSearchedCategories[0]) ||
    find(categories, ['id', productCategory?.id]);

  const getPath = ({ category, subcategory }) => {
    const categoryId = find(categories, ['title', category || subcategory])?.id;
    const subcategories = filter(categories, [
      category ? 'parentId' : 'id',
      categoryId,
    ]);

    setSearchParams([['categories', map(subcategories, 'id')]]);
  };

  const breadcrumbs = compact([
    { id: 1, value: { title: 'Lots' } },
    parentCategory && { id: 2, value: parentCategory },
    subcategory && { id: 3, value: subcategory },
    lotId && { id: 4, value: { title } },
  ]);

  const handleClick = ({ id, value }) => {
    if (id === 1) {
      if (!lotId) {
        setSearchParams('');
        setSelectedCategoriesIds([]);
        setSelectedSubcategoriesIds([]);
      }

      navigate(LOTS);
    } else {
      lotId && navigate(LOTS);
      getPath({
        category: id === 2 ? value.title : null,
        subcategory: id === 3 ? value.title : null,
      });
    }
  };

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
