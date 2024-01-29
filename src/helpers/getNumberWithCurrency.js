const getNumberWithCurrency = (number, currency) => {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency,
  }).format(number);
};

export default getNumberWithCurrency;
