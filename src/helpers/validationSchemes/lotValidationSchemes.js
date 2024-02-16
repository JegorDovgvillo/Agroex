import { object, date } from 'yup';

import {
  getTextFieldValidationSchema,
  getNumberFieldValidationSchema,
  getSelectFieldValidationSchema,
  requiredMessage,
} from './schemasForFields';

const currentDate = new Date();

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

export const subcategoryCreationValidationSchema = object().shape({
  parentId: getSelectFieldValidationSchema('parentId'),
  title: getTextFieldValidationSchema(1, 35),
});
