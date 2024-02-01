const getNumberWithCurrency = (number, currency = false, locale = 'en') =>
  new Intl.NumberFormat(
    locale,
    currency ? { style: 'currency', currency } : undefined
  ).format(number);

export default getNumberWithCurrency;
