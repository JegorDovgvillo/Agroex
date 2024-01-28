const getNumberWithCurrency = (number, currency) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(number);
};

export default getNumberWithCurrency;
