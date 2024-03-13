import { object, number } from 'yup';

import getNumberWithCurrency from '@helpers/getNumberWithCurrency';

const placeBetValidationSchema = (minAmount, maxAmount, currency) => {
  const minAmountWithCurrency = getNumberWithCurrency(minAmount, currency);
  const maxAmountWithCurrency = getNumberWithCurrency(maxAmount, currency);
  const errorMessage = `Your bet should be between ${minAmountWithCurrency} and ${maxAmountWithCurrency}`;

  return object().shape({
    amount: number()
      .min(minAmount, errorMessage)
      .max(maxAmount, errorMessage)
      .required('Bet is required'),
  });
};

export { placeBetValidationSchema };
