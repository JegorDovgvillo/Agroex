import { object, string } from 'yup';

import {
  getTextFieldValidationSchema,
  requiredMessage,
  getPasswordFieldValidationSchema,
} from './schemasForFields';

const commonUserFields = {
  name: getTextFieldValidationSchema(1, 30),
  email: string().required(requiredMessage).email('Not a valid email'),
};

export const updateUserValidationSchema = object().shape({
  ...commonUserFields,
});

export const userPasswordsValidationSchema = object().shape({
  oldPassword: getPasswordFieldValidationSchema(),
  newPassword: getPasswordFieldValidationSchema(),
});
