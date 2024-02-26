import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAllCategories } from '@thunks/fetchCategories';
import { selectRootCategories } from '@slices/categoriesSlice';

import HomePageTabPanel from '@components/customTabPanels/homePageTabPanel';

const HomePage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectRootCategories);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  return (
    <>{categories.length > 0 && <HomePageTabPanel categories={categories} />}</>
  );
};

export default HomePage;
