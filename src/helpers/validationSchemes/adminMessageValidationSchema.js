import { object } from 'yup';

import { getTextFieldValidationSchema } from './schemasForFields';

export const adminMessageValidationSchema = object().shape({
  message: getTextFieldValidationSchema(1, 200),
});
