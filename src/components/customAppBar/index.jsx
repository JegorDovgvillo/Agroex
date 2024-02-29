import { Toolbar, IconButton, AppBar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import styles from './appBar.module.scss';

const {
  appBar,
  toolBarHeader,
  toolBarBtn,
  hidden,
  toolBarTitle,
  appBarOpened,
  appBarClosed,
} = styles;

const CustomAppBar = ({ isOpen, toggleDrawer, isBarVisible, user }) => {
  return (
    <AppBar
      open={isOpen}
      className={`${appBar}  ${isOpen ? appBarOpened : appBarClosed}`}
    >
      <Toolbar className={toolBarHeader}>
        <IconButton
          className={`${toolBarBtn} ${isOpen && hidden}`}
          edge="start"
          aria-label="isOpen drawer"
          onClick={toggleDrawer}
        >
          {isBarVisible && <MenuIcon />}
        </IconButton>
        <h5 className={toolBarTitle}>{user && user.name}</h5>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
