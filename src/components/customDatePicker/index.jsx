import { DateTime } from 'luxon';
import Stack from '@mui/material/Stack';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState } from 'react';

import './customDatePicker.module.scss';

const CustomDatePicker = ({ onChange }) => {
  const [value, setValue] = useState(null);

  const handleDateChange = (newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Stack spacing={10} sx={{ minWidth: 436, m: '0 16px 24px 0' }}>
        <DateTimePicker
          value={value}
          onChange={handleDateChange}
          referenceDate={DateTime.fromISO('2022-04-17T15:30')}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
