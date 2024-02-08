import { useParams, useNavigate, generatePath } from 'react-router-dom';

import { Tabs, Tab, Box } from '@mui/material';

import ROUTES from '@helpers/routeNames';

import TabPanel from './tabPanel';
import userProfileData from '../userProfile/userProfileData';

import styles from './customTabPanel.module.scss';

const { tabItem } = styles;

function a11yProps(index) {
  return {
    'id': `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const { USER_PROFILE_PAGE_TAB } = ROUTES;

const CustomTabPanel = () => {
  const navigate = useNavigate();
  const { page, tab } = useParams();

  const currPage = userProfileData.find((p) => p.route === page);
  const { tabs } = currPage;
  const currTabId = tabs.find((t) => t.tabRoute === tab).id;

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
          {tabs.map((t) => (
            <Tab
              className={tabItem}
              key={t.id}
              label={`${t.tabRoute.charAt(0).toUpperCase()}${t.tabRoute.slice(
                1
              )}`}
              {...a11yProps(t.id)}
            />
          ))}
        </Tabs>
      </Box>

      {tabs.map((t) => (
        <TabPanel key={t.id} value={currTabId} index={t.id}>
          {currPage.element}
        </TabPanel>
      ))}
    </Box>
  );
};

export default CustomTabPanel;
