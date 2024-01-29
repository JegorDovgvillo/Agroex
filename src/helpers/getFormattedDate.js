const getFormattedDate = (date, locale = 'ru') => {
  const dateObject = new Date(date);

  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  };

  return new Intl.DateTimeFormat(locale, options).format(dateObject);
};

export default getFormattedDate;
