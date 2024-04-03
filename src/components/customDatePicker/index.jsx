import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DateTime } from 'luxon';
import { Stack, FormHelperText, FormControl } from '@mui/material';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { deleteError } from '@slices/lotListSlice';

import styles from './customDatePicker.module.scss';

const CustomDatePicker = ({
  onChange,
  value,
  errors,
  touched,
  label = 'Expiration date',
}) => {
  const [date, setDate] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    value ? setDate(DateTime.fromISO(value)) : setDate(null);
  }, [value]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onChange(newDate);
    errors && dispatch(deleteError(name));
  };

  const isError = !!errors && !!touched;

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Stack
        spacing={10}
        className={`${styles.datePicker} ${
          isError ? styles.error : styles.default
        }`}
      >
        <FormControl error={isError}>
          <label>{label}</label>
          <DateTimePicker
            value={date}
            onChange={handleDateChange}
            referenceDate={DateTime.now()}
            slotProps={{
              popper: {
                className: styles.popper,
                disablePortal: true,
              },
            }}
          />
          {isError && <FormHelperText>{errors}</FormHelperText>}
        </FormControl>
      </Stack>
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
