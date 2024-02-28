import { object, string } from 'yup';

import {
  getTextFieldValidationSchema,
  requiredMessage,
} from './schemasForFields';

const commonUserFields = {
  name: getTextFieldValidationSchema(1, 30),
  email: string().required(requiredMessage).email('Not a valid email'),
};

export const createUserValidationSchema = object().shape({
  ...commonUserFields,
  oldPassword: string()
    .required(requiredMessage)
    .test(
      'contains-digit',
      'Password should contain at least one digit',
      (value) => /\d/.test(value)
    )
    .test(
      'contains-lowercase',
      'Password should contain at least one lowercase letter',
      (value) => /[a-z]/.test(value)
    )
    .test(
      'contains-uppercase',
      'Password should contain at least one uppercase letter',
      (value) => /[A-Z]/.test(value)
    )
    .test(
      'is-long-enough',
      'Password should be at least 8 characters long',
      (value) => value.length >= 8
    ),
  newPassword: string()
    .required(requiredMessage)
    .test(
      'contains-digit',
      'Password should contain at least one digit',
      (value) => /\d/.test(value)
    )
    .test(
      'contains-lowercase',
      'Password should contain at least one lowercase letter',
      (value) => /[a-z]/.test(value)
    )
    .test(
      'contains-uppercase',
      'Password should contain at least one uppercase letter',
      (value) => /[A-Z]/.test(value)
    )
    .test(
      'is-long-enough',
      'Password should be at least 8 characters long',
      (value) => value.length >= 8
    ),
});

export const updateUserValidationSchema = object().shape({
  ...commonUserFields,
});
