import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, generatePath } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { isEmpty, toLower } from 'lodash';

import { CustomButton } from '@components/buttons/CustomButton';
import { fetchAllCategories } from '@thunks/fetchCategories';
import { selectRootCategories } from '@slices/categoriesSlice';
import ROUTES from '@helpers/routeNames';
import imageSrc from '@assets/images/notFound.jpg';

import styles from './404.module.scss';

const { pageWrapper, container, title } = styles;

const { HOME_PAGE, LOTS } = ROUTES;

const NotFoundPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [homePagePath, setHomePagePath] = useState(null);
  const categories = useSelector(selectRootCategories);

  const handleGoHome = () => {
    navigate(homePagePath);
  };

  const handleSeeLots = () => navigate(LOTS);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isEmpty(categories)) return;

    const defaultCategory = toLower(categories[0].title);
    const path = generatePath(HOME_PAGE, { category: defaultCategory });

    setHomePagePath(path);
  }, [categories]);

  return (
    <div className={pageWrapper}>
      <img src={imageSrc} alt="Not found image" />
      <div className={container}>
        <h3 className={title}>
          Sorry... something went wrong and we can't display the page
        </h3>
        <h5>but you can</h5>
        <Stack spacing={2} direction="row">
          {homePagePath && (
            <CustomButton
              text="Go home"
              typeOfButton="button"
              handleClick={handleGoHome}
            />
          )}
          <CustomButton
            text="See lots"
            typeOfButton="button"
            handleClick={handleSeeLots}
            width="auto"
          />
        </Stack>
      </div>
    </div>
  );
};

export default NotFoundPage;
