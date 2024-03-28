import { object, string, date, ref } from 'yup';

export const adminReportsValidationSchema = object().shape({
  reportType: string().required('Report type is required'),
  actualStartDate: date().when('expirationDate', (expirationDate, schema) => {
    return expirationDate
      ? schema.max(expirationDate, 'Start date cannot be after end date')
      : schema;
  }),
});
