import { useState, useEffect } from 'react';
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

const { LOTS, HOME_PAGE } = ROUTES;

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const HomePageTabPanel = ({ categories }) => {
  const { category } = useParams();
  const parentCategories = _.filter(
    categories,
    (category) => category.parentId === 0
  );
  const subcategories = _.filter(
    categories,
    (category) => category.parentId !== 0
  );
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryIndex = _.findIndex(parentCategories, (categoryEl) =>
    _.isEqual(_.toLower(categoryEl.title), category)
  );
  const [currTabIndex, setCurrTabIndex] = useState(
    categoryIndex > -1 ? categoryIndex : 0
  );

  const handleChange = (event, newValue) => {
    setCurrTabIndex(newValue);

    const path = generatePath(HOME_PAGE, {
      category: _.toLower(parentCategories[newValue].title),
    });

    navigate(path);
  };

  const getPath = (id) => {
    const query = `?subcategories=${id}`;

    return `${LOTS}${query}`;
  };

  const handleCategoryLotsClick = (id) => {
    const targetSubcategories = _.filter(subcategories, ['parentId', id]);
    const targetCategories = _.filter(parentCategories, ['id', id]);

    navigate(LOTS);
    setSearchParams([
      ['subcategories', _.map(targetSubcategories, 'id')],
      ['categories', _.map(targetCategories, 'id')],
    ]);
  };

  const handleShowAllClick = () => {
    navigate(LOTS);
  };

  useEffect(() => {
    if (!category) {
      const path = generatePath(HOME_PAGE, {
        category: _.toLower(parentCategories[0].title),
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
          {parentCategories.map((category) => (
            <Tab
              className={`${tabItem} ${
                parentCategories[currTabIndex].id === category.id
                  ? tabItemActive
                  : ''
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
              handleCategoryLotsClick(parentCategories?.[currTabIndex]?.id)
            }
            className={`${listItem} ${listItemAllLink}`}
            key={parentCategories?.[currTabIndex]?.id}
          >
            {`All ${parentCategories?.[currTabIndex]?.title}`}
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
