import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, generatePath, useParams, Link } from 'react-router-dom';
import _ from 'lodash';

import { Tabs, Tab, Box } from '@mui/material';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';

import { selectCategoryByParentId } from '@slices/categoriesSlice';

import ROUTES from '@helpers/routeNames';

import TabPanel from '../tabPanel';
import SubcategoryBanner from './subcategoryBanner';

import styles from '../customTabPanel.module.scss';

const {
  homePageContainer,
  tabsContainer,
  tabItem,
  tabItemActive,
  categoriesTabsPanel,
  subcategoriesContainer,
  subcategoriesListContainer,
  listItem,
  subcategoriesLinksContainer,
} = styles;

const { CATEGORY_PAGE, SUBCATEGORY_LOTS_PAGE } = ROUTES;

function a11yProps(index) {
  return {
    'id': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const HomePageTabPanel = ({ categories }) => {
  const { category } = useParams();

  const navigate = useNavigate();

  const categoryIndex = _.findIndex(categories, (categoryEl) =>
    _.isEqual(categoryEl.title, category)
  );

  const [currTabIndex, setCurrTabIndex] = useState(
    categoryIndex > -1 ? categoryIndex : 0
  );

  const subcategories = useSelector((state) =>
    selectCategoryByParentId(state, categories?.[currTabIndex]?.id)
  );

  useEffect(() => {
    if (!category) {
      const path = generatePath(CATEGORY_PAGE, {
        category: _.toLower(categories[0].title),
      });
      navigate(path);
    }
  }, []);

  const handleChange = (event, newValue) => {
    setCurrTabIndex(newValue);

    const path = generatePath(CATEGORY_PAGE, {
      category: _.toLower(categories[newValue].title),
    });

    navigate(path);
  };

  const getPath = ({ title, id }) => {
    if (category) {
      const query = `?categories=${id}`;
      const lotListPath = generatePath(SUBCATEGORY_LOTS_PAGE, {
        category: category,
        subcategory: _.toLower(title),
      });

      return `${lotListPath}${query}`;
    }
  };

  return (
    <Box className={homePageContainer}>
      <Box className={tabsContainer}>
        <Tabs
          value={currTabIndex}
          onChange={handleChange}
          aria-label="basic tabs example"
          className={categoriesTabsPanel}
        >
          {categories.map((category) => (
            <Tab
              className={`${tabItem} ${
                categories[currTabIndex].id === category.id ? tabItemActive : ''
              }`}
              key={category.id}
              label={<div>{category.title}</div>}
              {...a11yProps(category.id)}
              icon={<GrassOutlinedIcon />}
            />
          ))}
        </Tabs>
      </Box>

      <TabPanel
        value={currTabIndex}
        index={currTabIndex}
        className={subcategoriesContainer}
      >
        <div className={subcategoriesListContainer}>
          {subcategories.map((subcategory) => (
            <Link
              to={`${getPath({ ...subcategory })}`}
              className={listItem}
              key={subcategory.id}
            >
              {subcategory.title}
            </Link>
          ))}
        </div>
        <div className={subcategoriesLinksContainer}>
          {subcategories.map((subcategory) => (
            <SubcategoryBanner
              key={subcategory.id}
              {...subcategory}
              path={`${getPath({ ...subcategory })}`}
            />
          ))}
        </div>
      </TabPanel>
    </Box>
  );
};

export default HomePageTabPanel;
