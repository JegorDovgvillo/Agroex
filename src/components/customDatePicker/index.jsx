import { DateTime } from 'luxon';
import Stack from '@mui/material/Stack';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useState } from 'react';

import './customDatePicker.module.scss';

const CustomDatePicker = ({ onChange }) => {
  const [date, setDate] = useState(null);

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
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
