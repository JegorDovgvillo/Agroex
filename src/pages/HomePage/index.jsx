import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, generatePath } from 'react-router-dom';

import { some, isEmpty, toLower } from 'lodash';

import { fetchAllCategories } from '@thunks/fetchCategories';
import { selectRootCategories } from '@slices/categoriesSlice';
import ROUTES from '@helpers/routeNames';

import HomePageTabPanel from '@components/customTabPanels/homePageTabPanel';

const { HOME_PAGE, NOT_FOUND } = ROUTES;

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category } = useParams();

  const [categoriesFetched, setIsCategoriesFetched] = useState(false);

  const categories = useSelector(selectRootCategories);

  useEffect(() => {
    (async () => {
      const resultAction = await dispatch(fetchAllCategories());
      const isSuccessAction = fetchAllCategories.fulfilled.match(resultAction);

      isSuccessAction
        ? setIsCategoriesFetched(true)
        : navigate(`/${NOT_FOUND}`);
    })();
  }, [dispatch]);

  useEffect(() => {
    if (!categoriesFetched) return;

    if (isEmpty(categories)) {
      navigate(`/${NOT_FOUND}`);

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
      navigate(`/${NOT_FOUND}`);
    }
  }, [categories, categoriesFetched]);

  return (
    <>{!isEmpty(categories) && <HomePageTabPanel categories={categories} />}</>
  );
};

export default HomePage;
