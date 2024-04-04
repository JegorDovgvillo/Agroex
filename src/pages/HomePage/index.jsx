import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, generatePath } from 'react-router-dom';
import _ from 'lodash';

import { fetchAllCategories } from '@thunks/fetchCategories';
import { getFilteredLots } from '@thunks/fetchLots';
import { categoriesSelector } from '@slices/categoriesSlice';
import { getSelectedCurrency } from '@slices/currencySlice';
import { lotListSelector, clearLots } from '@slices/lotListSlice';

import ROUTES from '@helpers/routeNames';

import HomePageTabPanel from '@components/customTabPanels/homePageTabPanel';
import imageSrc from '@assets/images/pic.jpg';

import styles from './homePage.module.scss';

const { pageWrapper, container, title, imageContainer } = styles;

const { HOME_PAGE, NOT_FOUND } = ROUTES;

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category } = useParams();
  const categories = useSelector(categoriesSelector);
  const lots = useSelector(lotListSelector);
  const selectedCurrency = useSelector(getSelectedCurrency);
  const [renderedCategories, setRenderedCategories] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (!selectedCurrency) return;

    dispatch(getFilteredLots({ params: {}, currency: selectedCurrency }));
  }, [selectedCurrency]);

  useEffect(() => {
    dispatch(clearLots());
    dispatch(fetchAllCategories());
    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (!categories || _.isEmpty(categories)) return;
    console.log(categories);
    const filteredCategories = _.filter(categories, (category) =>
      _.some(lots, (lot) =>
        _.includes(
          [lot.productCategory.id, lot.productCategory.parentId],
          category.id
        )
      )
    );

    if (
      !_.isEmpty(filteredCategories) &&
      !_.some(
        filteredCategories,
        (cat) => _.toLower(cat.title) === _.toLower(category)
      )
    ) {
      navigate(NOT_FOUND);
    }

    setRenderedCategories(filteredCategories);

    if (!category && !_.isEmpty(filteredCategories)) {
      const defaultCategory = _.toLower(filteredCategories[0].title);
      const path = generatePath(HOME_PAGE, { category: defaultCategory });

      navigate(path);
    }
  }, [categories, lots]);

  return (
    <>
      {isDataLoaded && (
        <>
          {!_.isEmpty(renderedCategories) ? (
            <HomePageTabPanel categories={renderedCategories} />
          ) : (
            <>
              <div className={pageWrapper}>
                <div className={container}>
                  <h3 className={title}>
                    Sorry... no available lots right now
                  </h3>
                </div>
                <div className={imageContainer}>
                  <img src={imageSrc} alt="No lots image" />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default HomePage;
