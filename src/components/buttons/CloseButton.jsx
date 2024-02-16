import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

import { getVariant } from './buttonsUtils';
import styles from './buttons.module.scss';

const getCloseClassName = (size) => {
  switch (size) {
    case 'L':
      return styles.closeLarge;
    case 'M':
      return styles.closeMedium;
    case 'S':
      return styles.closeSmall;
    default:
      return styles.closeLarge;
  }
};

export const CloseButton = ({
  size = 'L',
  type = 'primary',
  disabled = false,
  handleClick,
}) => {
  const buttonStyles = getCloseClassName(size);
  const variant = getVariant(type);

  return (
    <Button
      variant={variant}
      disabled={disabled}
      type="button"
      onClick={handleClick}
      className={`${styles.commonButtonStyles} ${buttonStyles}`}
    >
      <CloseIcon className={styles.icon} />
    </Button>
  );
};
