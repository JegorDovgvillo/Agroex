import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import Stack from '@mui/material/Stack';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import styles from './customDatePicker.module.scss';

const CustomDatePicker = ({ onChange, value }) => {
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
      <Stack spacing={10} sx={{ minWidth: 436, m: '0 16px 24px 0' }}>
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
      </Stack>
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
