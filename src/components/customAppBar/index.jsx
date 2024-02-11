import { Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import AppBar from './appBar';

import styles from './appBar.module.scss';

const { appBar, toolBarHeader, toolBarBtn, hidden, toolBarTitle } = styles;

const CustomAppBar = ({ isOpen, toggleDrawer, isBarVisible }) => {
  return (
    <AppBar isOpen={isOpen} className={appBar}>
      <Toolbar className={toolBarHeader}>
        <IconButton
          className={`${toolBarBtn} ${isOpen && hidden}`}
          edge="start"
          aria-label="isOpen drawer"
          onClick={toggleDrawer}
        >
          {isBarVisible && <MenuIcon />}
        </IconButton>
        <h5 className={toolBarTitle}>User Name</h5>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
