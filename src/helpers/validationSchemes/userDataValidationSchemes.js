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
  oldPassword: getPasswordFieldValidationSchema().test(
    'old-password-match',
    'Old password should not match with the new password or confirmed password',
    function (value, { parent }) {
      return value !== parent.newPassword && value !== parent.retryPassword;
    }
  ),
  newPassword: getPasswordFieldValidationSchema().test(
    'new-password-match',
    'New password should match the confirmed password',
    function (value, { parent }) {
      return value !== parent.oldPassword && value === parent.retryPassword;
    }
  ),
  retryPassword: getPasswordFieldValidationSchema().test(
    'retry-password-match',
    'Confirmed password should match the new password',
    function (value, { parent }) {
      return value !== parent.oldPassword && value === parent.newPassword;
    }
  ),
});
