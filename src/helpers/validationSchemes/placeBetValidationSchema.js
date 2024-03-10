import { object, number } from 'yup';

const placeBetValidationSchema = (minAmount, maxAmount) => {
  const errorMessage = `Your bet should be between ${minAmount} and ${maxAmount}`;

  return object().shape({
    amount: number()
      .min(minAmount, errorMessage)
      .max(maxAmount, errorMessage)
      .required('Bet is required'),
  });
};

export { placeBetValidationSchema };
