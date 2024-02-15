import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AgroexLogo from '@icons/AgroexLogoHeader.svg';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import CloseIcon from '@mui/icons-material/Close';

import ROUTES from '@helpers/routeNames';

import styles from './header.module.scss';

const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [isActive, setIsActive] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.target.nodeName == 'svg') {
      setIsActive(false);
      navigate(ROUTES.LOTS);
      setSearchParams({ keyword: inputValue });
    }
  };

  const resetSearch = () => {
    setIsActive(false);
    setInputValue('');
    setSearchParams('');
  };

  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.link}>
        <div>
          <img src={AgroexLogo} alt="Agroex Logo" />
        </div>
      </NavLink>
      <div className={styles.searchWrapp}>
        <SearchIcon className={styles.icon} />
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onClick={() => setIsActive(true)}
          onKeyDown={(e) => handleKeyPress(e)}
          className={styles.searchInput}
          placeholder="Search"
        />
      </div>
      {isActive ? (
        <>
          <KeyboardReturnIcon
            className={styles.sendButton}
            onClick={(e) => handleKeyPress(e)}
          />
          <CloseIcon className={styles.closeIcon} onClick={resetSearch} />
        </>
      ) : null}
    </header>
  );
};

export default Header;
