export const getButtonText = (lotType) => {
  let text = '';

  switch (lotType) {
    case 'sell':
    case 'auctionSell':
      text = 'buy';
      break;

    case 'buy':
      text = 'sell';
      break;
  }

  return `${text} now`;
};
