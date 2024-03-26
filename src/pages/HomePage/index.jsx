import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, generatePath } from 'react-router-dom';

import { some, capitalize, isEmpty, toLower, includes } from 'lodash';

import { fetchAllCategories } from '@thunks/fetchCategories';
import { selectRootCategories } from '@slices/categoriesSlice';
import ROUTES from '@helpers/routeNames';

import HomePageTabPanel from '@components/customTabPanels/homePageTabPanel';

const { HOME_PAGE, NOT_FOUND } = ROUTES;

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category } = useParams();

  const categories = useSelector(selectRootCategories);
  const fetchCategoriesLoadingStatus = useSelector(
    (state) => state.categories.fetchAllCategoriesStatus
  );

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!includes(['fulfilled', 'rejected'], fetchCategoriesLoadingStatus))
      return;

    if (
      includes(['rejected'], fetchCategoriesLoadingStatus) ||
      isEmpty(categories)
    ) {
      navigate(`/${NOT_FOUND}`);

      return;
    }

    if (!category) {
      const defaultCategory = toLower(categories[0].title);
      const path = generatePath(HOME_PAGE, { category: defaultCategory });

      navigate(path);
    }

    if (category && !some(categories, ['title', capitalize(category)])) {
      navigate(`/${NOT_FOUND}`);
    }
  }, [categories, fetchCategoriesLoadingStatus]);

  return (
    <>{categories.length > 0 && <HomePageTabPanel categories={categories} />}</>
  );
};

export default HomePage;
