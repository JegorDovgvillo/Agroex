import { useParams, useNavigate, generatePath } from 'react-router-dom';

import { Tabs, Tab, Box } from '@mui/material';

import ROUTES from '@helpers/routeNames';

import TabPanel from './tabPanel';
import userProfileData from '../userProfile/userProfileData';

import styles from './customTabPanel.module.scss';

const { tabItem } = styles;

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const { USER_PROFILE_PAGE_TAB } = ROUTES;

const CustomTabPanel = () => {
  const navigate = useNavigate();
  const { page, tab } = useParams();

  const { tabs, element } = userProfileData.find(
    (dataItem) => dataItem.route === page
  );

  const currTabId = tabs.find((tabEl) => tabEl.tabRoute === tab).id;

  const handleChange = (event, newValue) => {
    const path = generatePath(USER_PROFILE_PAGE_TAB, {
      page: page,
      tab: tabs[newValue].tabRoute,
    });

    navigate(path);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currTabId}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {tabs.map((tab) => (
            <Tab
              className={tabItem}
              key={tab.id}
              label={`${tab.tabRoute
                .charAt(0)
                .toUpperCase()}${tab.tabRoute.slice(1)}`}
              {...a11yProps(tab.id)}
            />
          ))}
        </Tabs>
      </Box>

      {tabs.map((tab) => (
        <TabPanel key={tab.id} value={currTabId} index={tab.id}>
          {element}
        </TabPanel>
      ))}
    </Box>
  );
};

export default CustomTabPanel;
