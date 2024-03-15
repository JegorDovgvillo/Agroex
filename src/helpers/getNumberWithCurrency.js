const getNumberWithCurrency = (number, currency = false, locale = 'en') => {
  return new Intl.NumberFormat(
    locale,
    currency ? { style: 'currency', currency } : undefined
  ).format(number);
};

export default getNumberWithCurrency;
