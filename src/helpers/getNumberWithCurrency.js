const getNumberWithCurrency = (number, currency, locale = 'en') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(number);
};

export default getNumberWithCurrency;
