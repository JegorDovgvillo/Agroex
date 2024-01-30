import Button from '@mui/material/Button';

import { getVariant } from './buttonsUtils';
import styles from './buttons.module.scss';

const getStyles = (size) => {
  switch (size) {
    case 'L':
      return styles.customLarge;
    case 'M':
      return styles.customMedium;
    case 'S':
      return styles.customSmall;
    default:
      return styles.customLarge;
  }
};

export const CustomButton = ({
  text = '',
  size = 'L',
  type = 'primary',
  disabled = false,
  icon = null,
  width = null,
  handleClick
}) => {
  const buttonStyles = getStyles(size);
  const variant = getVariant(type);
  
  return (
    <Button
      startIcon={icon || undefined}
      variant={variant}
      disabled={disabled}
      style={width && { width: width }}
      className={`${styles.commonButtonStyles} ${buttonStyles}`}
      onClick={handleClick}
    >
      {text}
    </Button>
  );
};
