import { string, number, object, date } from 'yup';

const currentDate = new Date();
const requiredMessage = 'Please fill in the field';

const getTextFieldValidationSchema = (min, max) => {
  const errorMessage = `The field should be from ${min} to ${max} characters long`;

  return string()
    .required(requiredMessage)
    .min(min, errorMessage)
    .max(max, errorMessage);
};

const getNumberFieldValidationSchema = (min, max) => {
  const errorMessage = `The field should contain only numbers from ${min} to ${max} (integer or fractional)`;

  return number()
    .required(requiredMessage)
    .typeError(errorMessage)
    .min(min, errorMessage)
    .max(max, errorMessage);
};

const getSelectFieldValidationSchema = (fieldName) => {
  const errorMessage = `Please choose a ${fieldName}`;

  return string().test('is-selected', errorMessage, function (value) {
    return value !== undefined && value !== '';
  });
};

export const lotValidationSchema = object().shape({
  title: getTextFieldValidationSchema(1, 30),
  region: getTextFieldValidationSchema(1, 30),
  variety: getTextFieldValidationSchema(1, 30),
  userId: getSelectFieldValidationSchema('user'),
  country: getSelectFieldValidationSchema('country'),
  category: getSelectFieldValidationSchema('category'),
  subcategory: getTextFieldValidationSchema(1, 35),
  description: getTextFieldValidationSchema(20, 1000),
  size: getTextFieldValidationSchema(1, 10),
  packaging: getTextFieldValidationSchema(1, 10),
  quantity: getNumberFieldValidationSchema(1, 999),
  price: getNumberFieldValidationSchema(1, 9999),
  priceUnits: getSelectFieldValidationSchema('currency'),
  lotType: getSelectFieldValidationSchema('lot type'),
  expirationDate: date()
    .required(requiredMessage)
    .min(
      currentDate,
      'The field should be valid date greater or equal to current date'
    ),
});

export const categoryTitleValidationSchema = object().shape({
  title: getTextFieldValidationSchema(1, 35),
});
