const getNumberWithCurrency = (number, currency, locale = 'en') => {
  if (currency) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(number);
  } else {
    return new Intl.NumberFormat('en-IN').format(number);
  }
};

export default getNumberWithCurrency;
