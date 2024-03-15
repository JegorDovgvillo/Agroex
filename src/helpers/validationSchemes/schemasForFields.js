import { string, number, array, lazy } from 'yup';

export const requiredMessage = 'Please fill in the field';

export const getTextFieldValidationSchema = (min, max) => {
  const errorMessage = `The field should be from ${min} to ${max} characters long`;

  return string()
    .required(requiredMessage)
    .min(min, errorMessage)
    .max(max, errorMessage);
};

export const getNumberFieldValidationSchema = (
  min,
  max,
  required = true,
  integer = false,
  rounding = 2
) => {
  const errorMessage = `The field should contain only numbers from ${min} to ${max} (integer${
    !integer ? ' or fractional' : ''
  })`;

  let schema = number()
    .typeError(errorMessage)
    .min(min, errorMessage)
    .max(max, errorMessage);

  if (integer) {
    schema = schema.integer('The field should be an integer');
  }

  if (required) {
    schema = schema.required(requiredMessage);
  }

  schema = schema.test(
    'decimal-places',
    `Only up to ${rounding} decimal places allowed`,
    (value) => {
      if (!value || !value.toString().includes('.')) {
        return true;
      }

      return value.toString().split('.')[1].length <= rounding;
    }
  );

  return schema;
};

export const getSelectFieldValidationSchema = (fieldName) => {
  const errorMessage = `Please choose a ${fieldName}`;

  return string().test('is-selected', errorMessage, function (value) {
    return value !== undefined && value !== '';
  });
};

export const tagsFieldValidationSchema = (min, max) => {
  const errorMessage = 'The field should be from 1 to 10 characters long';

  return lazy((value) => {
    if (typeof value === 'string') {
      return string().min(min, errorMessage).max(max, errorMessage);
    }

    return array()
      .of(string().min(min, errorMessage).max(max, errorMessage))
      .max(6, 'Maximum 6 tags allowed to be added');
  });
};

export const getPasswordFieldValidationSchema = () => {
  const commonSchema = string()
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
      'contains-special-characters',
      'Password should contain at least one special character',
      (value) => /[!@#$%^&*\/(),.?":{}|<>]/.test(value)
    )
    .test(
      'is-long-enough',
      'Password should be at least 8 characters long',
      (value) => value.length >= 8
    );

  return commonSchema;
};
