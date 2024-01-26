export const getVariant = (type) => {
  switch (type) {
    case 'primary':
      return 'contained';
    case 'secondary':
      return 'outlined';
    case 'clear':
      return 'text';
    default:
      return 'contained';
  }
};
