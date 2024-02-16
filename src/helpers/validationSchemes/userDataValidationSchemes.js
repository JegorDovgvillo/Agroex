import { object, string } from 'yup';

import {
  getTextFieldValidationSchema,
  requiredMessage,
} from './schemasForFields';

const phoneRegExp = /^\+?[0-9]{1,}$/;

const commonUserFields = {
  username: getTextFieldValidationSchema(1, 30),
  email: string().required(requiredMessage).email('Not a valid email'),
  phoneNumber: string()
    .required(requiredMessage)
    .matches(phoneRegExp, 'Phone number is not valid'),
};

export const createUserValidationSchema = object().shape({
  ...commonUserFields,
  password: string()
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
