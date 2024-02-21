import { Link, useParams, generatePath } from 'react-router-dom';
import { compact, find, toLower } from 'lodash';
import { Breadcrumbs, Typography } from '@mui/material';

import ROUTES from '@helpers/routeNames';

import styles from './customBreadcrumbs.module.scss';

const { container, link } = styles;

const { CATEGORY_PAGE, SUBCATEGORY_LOTS_PAGE } = ROUTES;

const CustomBreadcrumbs = ({ title = '', categories }) => {
  const { category, subcategory, id: lotId } = useParams();

  const categoryValue = (param) =>
    categories.length > 0 &&
    find(categories, (cat) => toLower(cat.title) === param).title;

  const rootPart = {
    id: 1,
    link: '/',
    value: 'Categories',
  };

  const categoryPart = category && {
    id: 2,
    link: generatePath(CATEGORY_PAGE, {
      category: category,
    }),
    value: categoryValue(category),
  };

  const subcategoryPart = subcategory && {
    id: 3,
    link: lotId
      ? generatePath(SUBCATEGORY_LOTS_PAGE, {
          category: category,
          subcategory: subcategory,
        })
      : null,
    value: categoryValue(subcategory),
  };

  const lotIdPart = lotId && {
    id: 4,
    link: null,
    value: title,
  };

  const filtersPart = !category && {
    id: 4,
    link: null,
    value: 'Filters',
  };

  const breadcrumbs = compact([
    rootPart,
    categoryPart,
    subcategoryPart,
    lotIdPart,
    filtersPart,
  ]);

  return (
    <div role="presentation" className={container}>
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((el, index) =>
          index !== breadcrumbs.length - 1 ? (
            <Link
              key={el.id}
              underline="hover"
              color="inherit"
              to={el.link}
              className={link}
            >
              {el.value}
            </Link>
          ) : (
            <Typography key={el.id} color="text.primary">
              {el.value}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </div>
  );
};

export default CustomBreadcrumbs;
