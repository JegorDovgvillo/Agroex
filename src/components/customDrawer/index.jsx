import { Toolbar, IconButton, Divider, List } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import Drawer from './drawer';

import styles from './customDrawer.module.scss';

const { toolBar, toolBarRightHeader } = styles;

const CustomDrawer = ({ open, isBarVisible, toggleDrawer, children }) => {
  const handleClick = () => {
    toggleDrawer();
  };

  return (
    <Drawer variant="permanent" open={open} className={toolBar}>
      <Toolbar className={toolBarRightHeader}>
        {isBarVisible && (
          <IconButton onClick={handleClick}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List component="nav">{children}</List>
    </Drawer>
  );
};

export default CustomDrawer;
