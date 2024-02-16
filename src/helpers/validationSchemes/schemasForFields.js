import { string, number } from 'yup';

export const requiredMessage = 'Please fill in the field';

export const getTextFieldValidationSchema = (min, max) => {
  const errorMessage = `The field should be from ${min} to ${max} characters long`;

  return string()
    .required(requiredMessage)
    .min(min, errorMessage)
    .max(max, errorMessage);
};

export const getNumberFieldValidationSchema = (min, max) => {
  const errorMessage = `The field should contain only numbers from ${min} to ${max} (integer or fractional)`;

  return number()
    .required(requiredMessage)
    .typeError(errorMessage)
    .min(min, errorMessage)
    .max(max, errorMessage);
};

export const getSelectFieldValidationSchema = (fieldName) => {
  const errorMessage = `Please choose a ${fieldName}`;

  return string().test('is-selected', errorMessage, function (value) {
    return value !== undefined && value !== '';
  });
};
