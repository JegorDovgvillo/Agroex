export const getButtonText = (lotType, price) => {
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

  const totalPrice = price ? `for ${price}` : '';

  return `${text} now ${totalPrice}`;
};
