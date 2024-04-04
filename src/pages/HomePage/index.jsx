import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, generatePath } from 'react-router-dom';

import { some, isEmpty, toLower, isNull } from 'lodash';

import { fetchAllCategories } from '@thunks/fetchCategories';
import { selectRootCategories } from '@slices/categoriesSlice';
import { lotListSelector } from '@slices/lotListSlice';
import { useLoadedWithoutErrorsSelector } from '@selectors';

import ROUTES from '@helpers/routeNames';

import HomePageTabPanel from '@components/customTabPanels/homePageTabPanel';

const { HOME_PAGE, NOT_FOUND } = ROUTES;

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category } = useParams();

  const [categoriesFetched, setIsCategoriesFetched] = useState(false);
  const isCategoriesLoaded = useLoadedWithoutErrorsSelector(['categories']);
  const categories = useSelector(selectRootCategories);
  const lots = useSelector(lotListSelector);

  useEffect(() => {
    if (isNull(isCategoriesLoaded)) {
      dispatch(fetchAllCategories());
    } else {
      isCategoriesLoaded === false && setIsCategoriesFetched(true);
    }
  }, [dispatch, isCategoriesLoaded]);

  useEffect(() => {
    if (!categoriesFetched) return;

    if (isEmpty(categories)) {
      navigate(NOT_FOUND);

      return;
    }

    if (!category) {
      const defaultCategory = toLower(categories[0].title);
      const path = generatePath(HOME_PAGE, { category: defaultCategory });

      navigate(path);
    }

    if (
      category &&
      !some(categories, (cat) => toLower(cat.title) === toLower(category))
    ) {
      navigate(NOT_FOUND);
    }
  }, [categories, categoriesFetched]);

  return (
    <>
      {!isEmpty(categories) && (
        <HomePageTabPanel categories={categories} lots={lots} />
      )}
    </>
  );
};

export default HomePage;
