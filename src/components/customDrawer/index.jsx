import { Toolbar, IconButton, Divider, List } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import Drawer from './drawer';

import styles from './customDrawer.module.scss';

const { toolBar, toolBarRightHeader } = styles;

const CustomDrawer = ({ isOpen, isBarVisible, toggleDrawer, children }) => {
  return (
    <Drawer variant="permanent" isOpen={isOpen} className={toolBar}>
      <Toolbar className={toolBarRightHeader}>
        {isBarVisible && (
          <IconButton onClick={toggleDrawer}>
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
