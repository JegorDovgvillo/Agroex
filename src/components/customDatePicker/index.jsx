import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { Stack, FormHelperText, FormControl, InputLabel } from '@mui/material';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import styles from './customDatePicker.module.scss';

const CustomDatePicker = ({ onChange, value, errors, touched }) => {
  const [date, setDate] = useState(null);

  useEffect(() => {
    value ? setDate(DateTime.fromISO(value)) : setDate(null);
  }, [value]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onChange(newDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Stack
        spacing={10}
        className={`${styles.datePicker} ${
          errors && touched ? styles.error : styles.default
        }`}
      >
        <FormControl error={touched && errors}>
          <label>Expiration date</label>
          <DateTimePicker
            value={date}
            onChange={handleDateChange}
            referenceDate={DateTime.fromISO('2024-01-01T15:30')}
            slotProps={{
              popper: {
                className: styles.popper,
                disablePortal: true,
              },
            }}
          />
          {errors && touched && <FormHelperText>{errors}</FormHelperText>}
        </FormControl>
      </Stack>
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
