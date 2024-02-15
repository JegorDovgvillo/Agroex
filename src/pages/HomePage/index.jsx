import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { Box, Tab, Tabs } from '@mui/material';

import { categoriesSelector } from '@slices/categoriesSlice';
import { fetchCategories } from '@thunks/fetchCategories';

const HomePage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(categoriesSelector);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { category, subcategory } = useParams();
  const [activeCategory, setActiveCategory] = useState(category);

  console.log(categories, activeCategory);

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Item One
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </div>
  );
};

export default HomePage;
