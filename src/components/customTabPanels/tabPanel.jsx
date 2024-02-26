import Box from '@mui/material/Box';

import styles from './customTabPanel.module.scss';

const { tab } = styles;

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box className={tab}>{children}</Box>}
    </div>
  );
};

export default TabPanel;
