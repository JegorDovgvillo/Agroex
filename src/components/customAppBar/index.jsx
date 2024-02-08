import { Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import AppBar from './appBar';

import styles from './appBar.module.scss';

const { appBar, toolBarHeader, toolBarBtn, hidden, toolBarTitle } = styles;

const CustomAppBar = ({ open, toggleDrawer, isBarVisible }) => {
  const handleClick = () => {
    toggleDrawer();
  };

  return (
    <AppBar open={open} className={appBar}>
      <Toolbar className={toolBarHeader}>
        <IconButton
          className={`${toolBarBtn} ${open && hidden}`}
          edge="start"
          aria-label="open drawer"
          onClick={handleClick}
        >
          {isBarVisible && <MenuIcon />}
        </IconButton>
        <h5 className={toolBarTitle}>User Name</h5>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
