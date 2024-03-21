import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

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
  const storedCurrencies =
    JSON.parse(localStorage.getItem('selectedCurrencies')) || [];
  const selectedCurrencyKey = useSelector(getSelectedCurrency);
  const [currencyItem, setCurrencyItem] = useState(null);
  const isOpen = Boolean(anchorEl);
  const userInfo = useSelector((state) => state.usersList.userInfo);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (currency) => {
    dispatch(setSelectedCurrency(currency));
    setAnchorEl(null);
  };

  useEffect(() => {
    const userCurrency = _.find(storedCurrencies, {
      userId: userInfo?.id || 'unregisteredUser',
    });

    dispatch(setSelectedCurrency(userCurrency?.currency || CURRENCY[0].key));
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (!selectedCurrencyKey) return;

    setCurrencyItem(_.find(CURRENCY, { key: selectedCurrencyKey }));

    const existingCurrencyIndex = _.findIndex(storedCurrencies, {
      userId: userInfo?.id || 'unregisteredUser',
    });

    if (existingCurrencyIndex !== -1) {
      storedCurrencies[existingCurrencyIndex].currency = selectedCurrencyKey;
    } else {
      storedCurrencies.push({
        userId: userInfo?.id || 'unregisteredUser',
        currency: selectedCurrencyKey,
      });
    }

    localStorage.setItem(
      'selectedCurrencies',
      JSON.stringify(storedCurrencies)
    );
  }, [selectedCurrencyKey]);

  return (
    <div>
      <Button
        className={`${currencyContainer} ${menuButton}`}
        id="currency-button"
        aria-controls={isOpen && 'currency-menu'}
        aria-haspopup="true"
        aria-expanded={isOpen && 'true'}
        onClick={handleClick}
      >
        <Avatar
          alt="Flag icon"
          src={currencyItem?.iconSrc}
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
