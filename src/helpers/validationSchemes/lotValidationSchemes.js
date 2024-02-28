import { object, date } from 'yup';
import { Duration } from 'luxon';

import {
  getTextFieldValidationSchema,
  getNumberFieldValidationSchema,
  getSelectFieldValidationSchema,
  requiredMessage,
  tagsFieldValidationSchema,
} from './schemasForFields';

const currentDate = new Date();

const commonLotFieldsValidationSchema = {
  title: getTextFieldValidationSchema(1, 30),
  region: getTextFieldValidationSchema(1, 30),
  variety: getTextFieldValidationSchema(1, 30),
  // userId: getSelectFieldValidationSchema('user'),
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
  tags: tagsFieldValidationSchema(1, 10),
};

export const lotValidationSchema = object().shape({
  ...commonLotFieldsValidationSchema,
  expirationDate: date()
    .required(requiredMessage)
    .min(
      currentDate,
      'The field should be valid date greater or equal to current date'
    ),
});

export const auctionLotValidationSchema = object().shape({
  ...commonLotFieldsValidationSchema,
  minPrice: getNumberFieldValidationSchema(1, 9999).test(
    'lessThanPrice',
    'Minimum price should be less than price',
    function (value) {
      const price = this.parent.price;

      return value < price;
    }
  ),
  days: getNumberFieldValidationSchema(0, 31, false, true),
  hours: getNumberFieldValidationSchema(0, 23, false, true),
  minutes: getNumberFieldValidationSchema(0, 59, false, true).test(
    'totalDuration',
    'The total duration should be at least 10 minutes',
    function () {
      const { days = 0, hours = 0, minutes = 0 } = this.parent;
      const totalDuration = Duration.fromObject({ days, hours, minutes });

      return totalDuration.as('minutes') >= 10;
    }
  ),
});

export const categoryTitleValidationSchema = object().shape({
  title: getTextFieldValidationSchema(1, 35),
});

export const subcategoryCreationValidationSchema = object().shape({
  parentId: getSelectFieldValidationSchema('parentId'),
  title: getTextFieldValidationSchema(1, 35),
});
