import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { find } from 'lodash';

import { Avatar, Button, Menu, MenuItem } from '@mui/material';

import { CURRENCY } from '@helpers/currency';
import {
  setSelectedCurrency,
  getSelectedCurrency,
} from '@slices/currencySlice';

import styles from './currencySelect.module.scss';

const { currencyContainer, currencyMenuItem, flag, menuButton } = styles;

export const CurrencySelect = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const selectedCurrencyKey = useSelector(getSelectedCurrency);
  const selectedCurrency = find(CURRENCY, { key: selectedCurrencyKey });
  const isOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (currency) => {
    dispatch(setSelectedCurrency(currency));
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        className={`${currencyContainer} ${menuButton}`}
        id="currency-button"
        aria-controls={isOpen ? 'currency-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={handleClick}
      >
        <Avatar
          alt="Flag icon"
          src={selectedCurrency.iconSrc}
          className={flag}
          variant="square"
        />
        {selectedCurrencyKey}
      </Button>
      <Menu
        id="currency-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={() => handleClose(selectedCurrencyKey)}
        MenuListProps={{
          'aria-labelledby': 'currency-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {CURRENCY.map((item) => (
          <MenuItem
            className={`${currencyContainer} ${currencyMenuItem}`}
            key={item.key}
            onClick={() => handleClose(item.key)}
            selected={item.key === selectedCurrencyKey}
          >
            <Avatar
              alt="Flag icon"
              src={item.iconSrc}
              className={flag}
              variant="square"
            />
            {item.key}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
