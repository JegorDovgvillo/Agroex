import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  useNavigate,
  generatePath,
  useParams,
  Link,
  useSearchParams,
} from 'react-router-dom';
import _ from 'lodash';

import { Tabs, Tab, Box, Typography } from '@mui/material';
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
  showAllLink,
  listItemAllLink,
} = styles;

const { LOTS, CATEGORY_PAGE } = ROUTES;

function a11yProps(index) {
  return {
    'id': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const HomePageTabPanel = ({ categories }) => {
  const { category } = useParams();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryIndex = _.findIndex(categories, (categoryEl) =>
    _.isEqual(_.toLower(categoryEl.title), category)
  );

  const [currTabIndex, setCurrTabIndex] = useState(
    categoryIndex > -1 ? categoryIndex : 0
  );

  const subcategories = useSelector((state) =>
    selectCategoryByParentId(state, categories?.[currTabIndex]?.id)
  );

  const handleChange = (event, newValue) => {
    setCurrTabIndex(newValue);

    const path = generatePath(CATEGORY_PAGE, {
      category: _.toLower(categories[newValue].title),
    });

    navigate(path);
  };

  const getPath = (id) => {
    const query = `?categories=${id}`;

    return `${LOTS}${query}`;
  };

  const handleCategoryLotsClick = (id) => {
    const targetSubcategories = _.filter(subcategories, ['parentId', id]);

    navigate(LOTS);
    setSearchParams([['categories', _.map(targetSubcategories, 'id')]]);
  };

  const handleShowAllClick = () => {
    navigate(LOTS);
  };

  useEffect(() => {
    if (!category) {
      const path = generatePath(CATEGORY_PAGE, {
        category: _.toLower(categories[0].title),
      });

      navigate(path);
    }
  }, []);

  return (
    <Box className={homePageContainer}>
      <Box className={tabsContainer}>
        <div className={showAllLink} onClick={handleShowAllClick}>
          <GrassOutlinedIcon />
          <div>All lots</div>
        </div>
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
          <Typography
            onClick={() =>
              handleCategoryLotsClick(categories?.[currTabIndex]?.id)
            }
            className={`${listItem} ${listItemAllLink}`}
            key={categories?.[currTabIndex]?.id}
          >
            {`All ${categories?.[currTabIndex]?.title}`}
          </Typography>
          {subcategories.map((subcategory) => (
            <Link
              to={`${getPath(subcategory.id)}`}
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
              path={`${getPath(subcategory.id)}`}
            />
          ))}
        </div>
      </TabPanel>
    </Box>
  );
};

export default HomePageTabPanel;
