import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import CloseIcon from '@mui/icons-material/Close';

import ROUTES from '@helpers/routeNames';

import styles from './search.module.scss';
import _ from 'lodash';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [isActive, setIsActive] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.target.id === 'sendIcon') {
      setIsActive(false);
      navigate(ROUTES.LOTS);
      setSearchParams(inputValue ? { keyword: inputValue.trim() } : '');
    }
  };

  const resetSearch = (e) => {

    if (_.isEmpty(inputValue)) {
      setIsActive(false);
    } else {
      setInputValue('');
    }
  };

  useEffect(() => {
    const keyword = searchParams.get('keyword');
    
    if (_.isNil(keyword)) {
      setInputValue('');
    } else {
      setInputValue(keyword);
    }
  }, [searchParams]);

  return (
    <>
      <div className={styles.searchWrapp}>
        <SearchIcon className={styles.searchIcon} />
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onClick={setIsActive}
          onKeyDown={handleKeyPress}
          className={
            isActive
              ? `${styles.searchInput} ${styles.activeInput} `
              : `${styles.searchInput}`
          }
          placeholder="Search"
        />
      </div>
      {isActive ? (
        <>
          <KeyboardReturnIcon
            className={styles.sendIcon}
            onClick={handleKeyPress}
            id="sendIcon"
          />
          <CloseIcon className={styles.closeIcon} onClick={resetSearch} />
        </>
      ) : null}
    </>
  );
};

export default Search;
