import { Toolbar, IconButton, Divider, List, Drawer } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import styles from './customDrawer.module.scss';

const { toolBar, toolBarRightHeader, toolBarOpened, toolBarClosed } = styles;

const CustomDrawer = ({ isOpen, isBarVisible, toggleDrawer, children }) => {
  return (
    <Drawer
      variant="permanent"
      open={isOpen}
      className={`${toolBar} ${isOpen ? toolBarOpened : toolBarClosed}`}
    >
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
